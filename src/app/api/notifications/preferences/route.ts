import { NextResponse, NextRequest } from "next/server";
import { getDb, serverTimestamp } from "@/lib/firebase/admin";

// Force Node.js runtime for firebase-admin
export const runtime = "nodejs";

const DEFAULT_PREFERENCES = {
  events: true,
  projects: true,
  admin: true,
  email: true,
};

/**
 * GET /api/notifications/preferences?userId=xxx
 * Get notification preferences for a user
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId parameter" },
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

    const userRef = db.collection("members").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = userDoc.data();
    const preferences = userData?.notificationPreferences || DEFAULT_PREFERENCES;

    return NextResponse.json(preferences);
  } catch (error) {
    console.error("Error getting notification preferences:", error);
    return NextResponse.json(
      { error: "Failed to get notification preferences" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/notifications/preferences
 * Update notification preferences for a user
 */
export async function PATCH(request: NextRequest) {
  try {
    const { userId, preferences } = await request.json();

    if (!userId || !preferences) {
      return NextResponse.json(
        { error: "Missing userId or preferences" },
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

    const userRef = db.collection("members").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Merge with existing preferences
    const userData = userDoc.data();
    const currentPreferences = userData?.notificationPreferences || DEFAULT_PREFERENCES;
    const updatedPreferences = { ...currentPreferences, ...preferences };

    await userRef.update({
      notificationPreferences: updatedPreferences,
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      preferences: updatedPreferences,
    });
  } catch (error) {
    console.error("Error updating notification preferences:", error);
    return NextResponse.json(
      { error: "Failed to update notification preferences" },
      { status: 500 }
    );
  }
}
