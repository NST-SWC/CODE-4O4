import { NextResponse, NextRequest } from "next/server";
import { getDb } from "@/lib/firebase/admin";

// Force Node.js runtime for firebase-admin
export const runtime = "nodejs";

// Simple in-memory cache with TTL
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 2 * 60 * 1000; // 2 minutes

function getCached(key: string) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

function setCache(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() });
  // Clean up old cache entries (simple cleanup)
  if (cache.size > 100) {
    const oldestKey = Array.from(cache.keys())[0];
    cache.delete(oldestKey);
  }
}

/**
 * GET /api/notifications?userId=xxx&limit=10&unreadOnly=true
 * Get notifications for a user
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const limit = parseInt(searchParams.get("limit") || "20");
    const unreadOnly = searchParams.get("unreadOnly") === "true";

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId parameter" },
        { status: 400 }
      );
    }

    // Check cache
    const cacheKey = `notifications:${userId}:${limit}:${unreadOnly}`;
    const cached = getCached(cacheKey);
    if (cached) {
      console.log("✅ Serving from cache");
      return NextResponse.json(cached);
    }

    const db = getDb();
    if (!db) {
      return NextResponse.json(
        { error: "Database not available" },
        { status: 500 }
      );
    }

    // Build query
    let query = db
      .collection("notifications")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .limit(limit);

    if (unreadOnly) {
      query = query.where("read", "==", false) as any;
    }

    const snapshot = await query.get();

    const notifications = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString(),
    }));

    // Count unread (use aggregation query for efficiency)
    const unreadSnapshot = await db
      .collection("notifications")
      .where("userId", "==", userId)
      .where("read", "==", false)
      .count()
      .get();

    const result = {
      notifications,
      unreadCount: unreadSnapshot.data().count,
      total: snapshot.size,
    };

    // Cache the result
    setCache(cacheKey, result);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error getting notifications:", error);
    return NextResponse.json(
      { error: "Failed to get notifications" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/notifications
 * Mark notifications as read
 */
export async function PATCH(request: NextRequest) {
  try {
    const { notificationIds, userId, markAllAsRead } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    const db = getDb();
    if (!db) {
      return NextResponse.json(
        { error: "Database not available" },
        { status: 500 }
      );
    }

    if (markAllAsRead) {
      // Mark all notifications as read for this user
      const snapshot = await db
        .collection("notifications")
        .where("userId", "==", userId)
        .where("read", "==", false)
        .get();

      const batch = db.batch();
      snapshot.docs.forEach((doc) => {
        batch.update(doc.ref, { read: true });
      });
      await batch.commit();

      // Invalidate cache for this user
      const cachePattern = `notifications:${userId}:`;
      for (const key of cache.keys()) {
        if (key.startsWith(cachePattern)) {
          cache.delete(key);
        }
      }

      return NextResponse.json({
        success: true,
        markedCount: snapshot.size,
      });
    } else if (notificationIds && Array.isArray(notificationIds)) {
      // Mark specific notifications as read
      const batch = db.batch();
      for (const id of notificationIds) {
        const docRef = db.collection("notifications").doc(id);
        batch.update(docRef, { read: true });
      }
      await batch.commit();

      // Invalidate cache for this user
      const cachePattern = `notifications:${userId}:`;
      for (const key of cache.keys()) {
        if (key.startsWith(cachePattern)) {
          cache.delete(key);
        }
      }

      return NextResponse.json({
        success: true,
        markedCount: notificationIds.length,
      });
    } else {
      return NextResponse.json(
        { error: "Must provide notificationIds or markAllAsRead" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    return NextResponse.json(
      { error: "Failed to mark notifications as read" },
      { status: 500 }
    );
  }
}
