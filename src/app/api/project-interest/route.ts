import { NextResponse } from "next/server";
import { getDb, serverTimestamp } from "@/lib/firebase/admin";

export async function POST(request: Request) {
  try {
    const { projectId, userId } = (await request.json()) as {
      projectId?: string;
      userId?: string;
    };
    if (!projectId || !userId) {
      return NextResponse.json(
        { ok: false, message: "Missing project or user id" },
        { status: 400 },
      );
    }
    const db = getDb();
    await db.collection("projectInterests").add({
      projectId,
      userId,
      createdAt: serverTimestamp(),
    });
    return NextResponse.json({ ok: true, message: "Project lead notified." });
  } catch (error) {
    console.error("project interest error", error);
    return NextResponse.json(
      { ok: false, message: "Unable to save interest.", error: String(error) },
      { status: 500 },
    );
  }
}
