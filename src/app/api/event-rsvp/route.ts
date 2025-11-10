import { NextResponse } from "next/server";
import { getDb, serverTimestamp } from "@/lib/firebase/admin";

export async function POST(request: Request) {
  try {
    const { eventId, userId } = (await request.json()) as {
      eventId?: string;
      userId?: string;
    };
    if (!eventId || !userId) {
      return NextResponse.json(
        { ok: false, message: "Missing event or user id" },
        { status: 400 },
      );
    }
    const db = getDb();
    await db.collection("eventRsvps").add({
      eventId,
      userId,
      createdAt: serverTimestamp(),
    });
    return NextResponse.json({ ok: true, message: "RSVP confirmed." });
  } catch (error) {
    console.error("event rsvp error", error);
    return NextResponse.json(
      { ok: false, message: "Unable to RSVP.", error: String(error) },
      { status: 500 },
    );
  }
}
