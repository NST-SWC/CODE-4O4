import { NextRequest, NextResponse } from "next/server";

// Slack sends interactive component payloads (buttons, etc.) to this URL.
// We don't currently process actions; we just acknowledge to prevent Slack errors.

export const runtime = "nodejs";

export async function POST(_req: NextRequest) {
  return NextResponse.json({ ok: true, ignored: true });
}

export async function GET() {
  return NextResponse.json({ ok: true });
}
