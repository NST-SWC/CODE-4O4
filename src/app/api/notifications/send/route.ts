import { NextResponse, NextRequest } from "next/server";
import { getDb, getMessaging, serverTimestamp } from "@/lib/firebase/admin";
import { verifyAdminAuth } from "@/lib/auth-utils";

// Force Node.js runtime for firebase-admin
export const runtime = "nodejs";

interface SendNotificationPayload {
  userId?: string;
  userIds?: string[];
  topic?: string;
  title: string;
  body: string;
  icon?: string;
  url?: string;
  data?: Record<string, string>;
}

/**
 * POST /api/notifications/send
 * Send push notifications to users
 * Requires admin authentication
 */
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request);
    if (!authResult.isAdmin) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    const payload: SendNotificationPayload = await request.json();

    if (!payload.title || !payload.body) {
      return NextResponse.json(
        { error: "Missing title or body" },
        { status: 400 }
      );
    }

    const db = getDb();
    const messaging = getMessaging();

    if (!db || !messaging) {
      return NextResponse.json(
        { error: "Firebase services not available" },
        { status: 500 }
      );
    }

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    // Prepare notification message
    const notificationData = {
      title: payload.title,
      body: payload.body,
      icon: payload.icon || "/icon-192x192.png",
    };

    const messageData = {
      ...payload.data,
      url: payload.url || "/",
    };

    // Send to specific user(s)
    if (payload.userId || payload.userIds) {
      const userIds = payload.userId ? [payload.userId] : payload.userIds!;

      for (const userId of userIds) {
        try {
          const userDoc = await db.collection("members").doc(userId).get();
          if (!userDoc.exists) continue;

          const userData = userDoc.data();
          const fcmTokens = userData?.fcmTokens || [];
          const preferences = userData?.notificationPreferences || {};

          // Check if user has notifications enabled
          if (preferences.push === false) continue;

          // Send to all user's devices
          for (const token of fcmTokens) {
            try {
              await messaging.send({
                token,
                notification: notificationData,
                data: messageData,
                webpush: {
                  fcmOptions: {
                    link: payload.url || "/",
                  },
                },
              });
              results.success++;
            } catch (error: unknown) {
              results.failed++;
              if (error instanceof Error) {
                results.errors.push(`Token ${token}: ${error.message}`);
              }
            }
          }

          // Store notification in database
          await db.collection("notifications").add({
            userId,
            title: payload.title,
            body: payload.body,
            url: payload.url || "/",
            icon: payload.icon,
            read: false,
            createdAt: serverTimestamp(),
          });
        } catch (error: unknown) {
          results.failed++;
          if (error instanceof Error) {
            results.errors.push(`User ${userId}: ${error.message}`);
          }
        }
      }
    }

    // Send to topic
    if (payload.topic) {
      try {
        await messaging.send({
          topic: payload.topic,
          notification: notificationData,
          data: messageData,
          webpush: {
            fcmOptions: {
              link: payload.url || "/",
            },
          },
        });
        results.success++;
      } catch (error: unknown) {
        results.failed++;
        if (error instanceof Error) {
          results.errors.push(`Topic ${payload.topic}: ${error.message}`);
        }
      }
    }

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error("Error sending notifications:", error);
    return NextResponse.json(
      { error: "Failed to send notifications" },
      { status: 500 }
    );
  }
}
