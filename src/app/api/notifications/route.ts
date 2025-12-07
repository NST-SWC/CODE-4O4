import { NextResponse, NextRequest } from "next/server";
import { getDb, serverTimestamp } from "@/lib/firebase/admin";
import type { QueryDocumentSnapshot } from "firebase-admin/firestore";

export const runtime = "nodejs";

const MAX_LIMIT = 40;

const serializeNotification = (doc: QueryDocumentSnapshot) => {
  const data = doc.data();
  const createdAt = data.createdAt?.toDate?.() ?? data.createdAt ?? null;
  const readAt = data.readAt?.toDate?.() ?? data.readAt ?? null;
  return {
    id: doc.id,
    title: data.title,
    body: data.body,
    url: data.url || "/",
    icon: data.icon || "/android-chrome-192x192.png",
    read: Boolean(data.read),
    createdAt: createdAt ? new Date(createdAt).toISOString() : null,
    readAt: readAt ? new Date(readAt).toISOString() : null,
    tag: data.tag || null,
    data: data.data || null,
  };
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        { ok: false, error: "Missing user id" },
        { status: 400 },
      );
    }

    const limitParam = Number(searchParams.get("limit") || "20");
    const limit = Number.isFinite(limitParam)
      ? Math.min(Math.max(Math.floor(limitParam), 1), MAX_LIMIT)
      : 20;
    const unreadOnly = searchParams.get("unreadOnly") === "true";

    const db = getDb();
    const snapshot = await db
      .collection("notifications")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get();

    let notifications = snapshot.docs.map(serializeNotification);
    if (unreadOnly) {
      notifications = notifications.filter((notif) => !notif.read);
    }

    return NextResponse.json({ ok: true, data: notifications });
  } catch (error: any) {
    console.error("❌ Failed to load notifications:", error);
    return NextResponse.json(
      {
        ok: false,
        error: error.message || "Failed to load notifications",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId, notificationIds, markAllAsRead } = await request.json();
    if (!userId) {
      return NextResponse.json(
        { ok: false, error: "Missing user id" },
        { status: 400 },
      );
    }

    const db = getDb();
    const batch = db.batch();
    let affected = 0;

    if (markAllAsRead) {
      const snap = await db.collection("notifications").where("userId", "==", userId).get();
      snap.forEach((doc) => {
        const data = doc.data();
        if (!data.read) {
          batch.update(doc.ref, { read: true, readAt: serverTimestamp() });
          affected += 1;
        }
      });
    } else if (Array.isArray(notificationIds) && notificationIds.length > 0) {
      notificationIds.slice(0, MAX_LIMIT).forEach((id: string) => {
        const ref = db.collection("notifications").doc(id);
        batch.update(ref, { read: true, readAt: serverTimestamp() });
      });
      affected = Math.min(notificationIds.length, MAX_LIMIT);
    } else {
      return NextResponse.json(
        { ok: false, error: "Provide notificationIds or set markAllAsRead" },
        { status: 400 },
      );
    }

    if (affected > 0) {
      await batch.commit();
    }

    return NextResponse.json({
      ok: true,
      updated: affected,
    });
  } catch (error: any) {
    console.error("❌ Failed to update notifications:", error);
    return NextResponse.json(
      {
        ok: false,
        error: error.message || "Failed to update notifications",
      },
      { status: 500 },
    );
  }
}
