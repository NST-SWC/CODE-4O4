import { NextResponse, NextRequest } from "next/server";
import { getDb } from "@/lib/firebase/admin";

// Force Node.js runtime for firebase-admin
export const runtime = "nodejs";

/**
 * POST /api/notifications/unsubscribe
 * Unsubscribe a device from receiving notifications
 */
export async function POST(request: NextRequest) {
  try {
    const { userId, token } = await request.json();

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

    // Remove FCM token from user's document
    const userRef = db.collection("members").doc(userId);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      const userData = userDoc.data();
      const existingTokens = userData?.fcmTokens || [];

      if (token) {
        // Remove specific token
        const updatedTokens = existingTokens.filter((t: string) => t !== token);
        await userRef.update({
          fcmTokens: updatedTokens,
        });

        // Deactivate subscription
        await db.collection("notificationSubscriptions").doc(token).update({
          active: false,
        });
      } else {
        // Remove all tokens
        await userRef.update({
          fcmTokens: [],
        });

        // Deactivate all subscriptions for this user
        const subscriptions = await db
          .collection("notificationSubscriptions")
          .where("userId", "==", userId)
          .get();

        const batch = db.batch();
        subscriptions.forEach((doc) => {
          batch.update(doc.ref, { active: false });
        });
        await batch.commit();
      }
    }

    return NextResponse.json({
      success: true,
      message: "Successfully unsubscribed from notifications",
    });
  } catch (error) {
    console.error("Error unsubscribing from notifications:", error);
    return NextResponse.json(
      { error: "Failed to unsubscribe from notifications" },
      { status: 500 }
    );
  }
}
