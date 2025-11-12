import { NextResponse, NextRequest } from "next/server";
import { getDb, serverTimestamp } from "@/lib/firebase/admin";

// Force Node.js runtime for firebase-admin
export const runtime = "nodejs";

/**
 * POST /api/notifications/subscribe
 * Subscribe a device to receive notifications
 */
export async function POST(request: NextRequest) {
  try {
    const { userId, token } = await request.json();

    if (!userId || !token) {
      return NextResponse.json(
        { error: "Missing userId or token" },
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

    // Save FCM token to user's document
    const userRef = db.collection("members").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get existing tokens or create empty array
    const userData = userDoc.data();
    const existingTokens = userData?.fcmTokens || [];

    // Add new token if it doesn't exist
    if (!existingTokens.includes(token)) {
      await userRef.update({
        fcmTokens: [...existingTokens, token],
        lastTokenUpdate: serverTimestamp(),
      });
    }

    // Create notification subscription record
    await db.collection("notificationSubscriptions").doc(token).set({
      userId,
      token,
      subscribedAt: serverTimestamp(),
      active: true,
    });

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to notifications",
    });
  } catch (error) {
    console.error("Error subscribing to notifications:", error);
    return NextResponse.json(
      { error: "Failed to subscribe to notifications" },
      { status: 500 }
    );
  }
}
