import { NextRequest, NextResponse } from "next/server";
import { isSlackConfigured, postSlackMessage, postSlackMessages } from "@/lib/server/slack";

export const runtime = "nodejs";

type SlackNotifyRequest = {
  text?: string;
  title?: string;
  body?: string;
  url?: string;
  channel?: string;
  channels?: string[];
  blocks?: any[];
  ping?: "here" | "channel";
  thread_ts?: string;
};

function isAdminFromCookie(cookieHeader: string | null) {
  if (!cookieHeader) return false;
  try {
    const cookies = cookieHeader.split(";").map((c) => c.trim());
    const userCookie = cookies.find((c) => c.startsWith("code404-user="));
    if (!userCookie) return false;
    const raw = userCookie.split("=")[1];
    if (!raw) return false;
    const decoded = decodeURIComponent(raw);
    const user = JSON.parse(decoded);
    return user && user.role === "admin";
  } catch (err) {
    return false;
  }
}

function isAuthorized(req: NextRequest) {
  const cookieHeader = req.headers.get("cookie");
  const secret = req.headers.get("x-slack-secret") || "";
  const isAdmin = isAdminFromCookie(cookieHeader);
  if (isAdmin) return true;
  if (process.env.SLACK_SEND_SECRET && secret === process.env.SLACK_SEND_SECRET) return true;
  return false;
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  if (!isSlackConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Slack is not configured. Set SLACK_WEBHOOK_URL or SLACK_BOT_TOKEN + SLACK_DEVCLUB_CHANNEL_ID.",
      },
      { status: 400 },
    );
  }

  let payload: SlackNotifyRequest;
  try {
    payload = await req.json();
  } catch (error) {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const { text, title, body, url, channel, channels, blocks, ping, thread_ts } = payload || {};

  const normalizedChannels = [
    ...(typeof channel === "string" ? [channel] : []),
    ...(Array.isArray(channels) ? channels : []),
  ]
    .map((ch) => (typeof ch === "string" ? ch.trim() : ""))
    .filter(Boolean);

  const targetChannels = Array.from(new Set(normalizedChannels));

  const hasContent = Boolean(text || title || body || (Array.isArray(blocks) && blocks.length > 0));
  if (!hasContent) {
    return NextResponse.json(
      { ok: false, error: "Provide text, title/body, or blocks for the Slack message." },
      { status: 400 },
    );
  }

  const mentionPrefix = ping === "channel" ? "<!channel> " : ping === "here" ? "<!here> " : "";
  const fallbackText =
    mentionPrefix +
    (text || [title, body, url].filter(Boolean).join(" — ") || "New notification from Dev Club");

  const messageBlocks =
    Array.isArray(blocks) && blocks.length > 0
      ? blocks
      : [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text:
                `${mentionPrefix}${title ? `*${title}*` : "New update"}` +
                (body ? `\n${body}` : ""),
            },
          },
        ];

  if (url) {
    messageBlocks.push({
      type: "actions",
      elements: [
        {
          type: "button",
          text: { type: "plain_text", text: "Open" },
          url,
        },
      ],
    });
  }

  try {
    const messagePayload = {
      text: fallbackText,
      blocks: messageBlocks,
      thread_ts,
    };

    const results =
      targetChannels.length > 0
        ? await postSlackMessages({ ...messagePayload, channels: targetChannels })
        : [await postSlackMessage(messagePayload)];

    const primary = results[0];

    return NextResponse.json({
      ok: true,
      channel: primary?.channel,
      ts: primary?.ts,
      method: primary?.method || "bot",
      results: results.map((result) => ({
        channel: result.channel,
        ts: result.ts,
        method: result.method || "bot",
      })),
    });
  } catch (error: any) {
    console.error("Failed to send Slack notification:", error);
    return NextResponse.json(
      { ok: false, error: error.message || "Failed to send Slack notification" },
      { status: 500 },
    );
  }
}
