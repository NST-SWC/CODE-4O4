#!/usr/bin/env node

/**
 * Send a message to the Dev Club Slack channel from the CLI.
 *
 * Usage:
 *   node scripts/send-slack-message.js "Your message"
 *   node scripts/send-slack-message.js "Release shipped" --url https://example.com --ping here
 */

require("dotenv").config({ path: ".env.local" });

const args = process.argv.slice(2);

function printUsage() {
  console.log("Usage: node scripts/send-slack-message.js \"Your message\" [--url https://link] [--ping here|channel] [--channel C123]");
  console.log("Uses SLACK_WEBHOOK_URL when set, otherwise SLACK_BOT_TOKEN + SLACK_DEVCLUB_CHANNEL_ID");
}

if (!args.length) {
  printUsage();
  process.exit(1);
}

let url;
let channel;
let ping;
const messageParts = [];

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === "--url") {
    url = args[i + 1];
    i += 1;
    continue;
  }
  if (arg === "--channel") {
    channel = args[i + 1];
    i += 1;
    continue;
  }
  if (arg === "--ping") {
    ping = args[i + 1];
    i += 1;
    continue;
  }
  messageParts.push(arg);
}

const text = messageParts.join(" ").trim();
if (!text) {
  printUsage();
  process.exit(1);
}

const mentionPrefix = ping === "channel" ? "<!channel> " : ping === "here" ? "<!here> " : "";

async function send() {
  const sectionText = `${mentionPrefix}${text}${url ? `\n${url}` : ""}`;
  const blocks = [
    {
      type: "section",
      text: { type: "mrkdwn", text: sectionText },
    },
  ];

  if (url) {
    blocks.push({
      type: "actions",
      elements: [
        {
          type: "button",
          text: { type: "plain_text", text: "Open link" },
          url,
        },
      ],
    });
  }

  const webhook = process.env.SLACK_WEBHOOK_URL;
  if (webhook) {
    const body = { text: `${mentionPrefix}${text}`, blocks };
    if (channel) body.channel = channel;
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg || "Slack webhook error");
    }
    console.log("✅ Sent via webhook");
    return;
  }

  const token = process.env.SLACK_BOT_TOKEN;
  const defaultChannel = process.env.SLACK_DEVCLUB_CHANNEL_ID;

  if (!token) {
    console.error("❌ SLACK_WEBHOOK_URL or SLACK_BOT_TOKEN must be set in .env.local");
    process.exit(1);
  }

  const targetChannel = channel || defaultChannel;
  if (!targetChannel) {
    console.error("❌ No channel provided and SLACK_DEVCLUB_CHANNEL_ID is missing.");
    process.exit(1);
  }

  const res = await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      channel: targetChannel,
      text: `${mentionPrefix}${text}`,
      blocks,
      unfurl_links: true,
      unfurl_media: false,
    }),
  });

  const data = await res.json();
  if (!data.ok) {
    throw new Error(data.error || "Slack API error");
  }

  console.log(`✅ Sent to ${data.channel} (ts: ${data.ts})`);
}

send().catch((err) => {
  console.error("❌ Failed to send Slack message:", err.message);
  process.exit(1);
});
