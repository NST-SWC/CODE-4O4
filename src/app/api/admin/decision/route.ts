import { NextResponse } from "next/server";
import { getDb, serverTimestamp } from "@/lib/firebase/admin";

export async function POST(request: Request) {
  try {
    const { id, decision } = (await request.json()) as {
      id?: string;
      decision?: "approve" | "hold" | string;
    };

    if (!id || !decision) {
      return NextResponse.json(
        { ok: false, message: "Missing id or decision" },
        { status: 400 },
      );
    }

    const db = getDb();
    await db.collection("adminDecisions").add({
      requestId: id,
      decision,
      actedAt: serverTimestamp(),
    });

    return NextResponse.json({ ok: true, message: "Decision recorded." });
  } catch (error) {
    console.error("admin decision error", error);
    return NextResponse.json(
      { ok: false, message: "Unable to persist decision.", error: String(error) },
      { status: 500 },
    );
  }
}
