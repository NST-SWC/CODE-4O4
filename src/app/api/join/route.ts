import { NextResponse } from "next/server";
import { getDb, serverTimestamp } from "@/lib/firebase/admin";
import type { JoinRequestPayload } from "@/types";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as JoinRequestPayload;
    if (!payload.displayName || !payload.email || !payload.phone) {
      return NextResponse.json(
        { ok: false, message: "Missing required fields." },
        { status: 400 },
      );
    }
    const db = getDb();
    await db.collection("joinRequests").add({
      ...payload,
      createdAt: serverTimestamp(),
      status: "pending",
    });
    return NextResponse.json({ ok: true, message: "Request received." });
  } catch (error) {
    console.error("join request error", error);
    return NextResponse.json(
      {
        ok: false,
        message: "Unable to store request. Check Firebase credentials.",
        error: String(error),
      },
      { status: 500 },
    );
  }
}
