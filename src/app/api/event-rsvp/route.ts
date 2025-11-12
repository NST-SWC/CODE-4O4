import { NextResponse } from "next/server";
import { getDb, serverTimestamp, getMessaging } from "@/lib/firebase/admin";

// Force Node.js runtime for firebase-admin
export const runtime = "nodejs";

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
    
    try {
      const db = getDb();
      
      // Save RSVP
      await db.collection("eventRsvps").add({
        eventId,
        userId,
        createdAt: serverTimestamp(),
      });
      
      // Get event details for notification
      const eventDoc = await db.collection("events").doc(eventId).get();
      const eventData = eventDoc.data();
      
      // Get user details
      const userDoc = await db.collection("members").doc(userId).get();
      const userData = userDoc.data();
      
      // Send confirmation notification
      if (userData?.fcmTokens && userData.fcmTokens.length > 0) {
        const messaging = getMessaging();
        const notificationTitle = `RSVP Confirmed: ${eventData?.title || "Event"}`;
        const notificationBody = `You're registered for ${eventData?.title || "the event"}${eventData?.date ? ` on ${eventData.date}` : ""}`;
        
        // Send to all user's devices
        for (const token of userData.fcmTokens) {
          try {
            if (messaging) {
              await messaging.send({
                token,
                notification: {
                  title: notificationTitle,
                  body: notificationBody,
                },
                data: {
                  url: `/events`,
                  eventId,
                  icon: "/icon-192x192.png",
                },
                webpush: {
                  fcmOptions: {
                    link: `/events`,
                  },
                  notification: {
                    icon: "/icon-192x192.png",
                  },
                },
              });
            }
          } catch (msgError) {
            console.error("Failed to send notification:", msgError);
          }
        }
        
        // Store notification in database
        await db.collection("notifications").add({
          userId,
          title: notificationTitle,
          body: notificationBody,
          url: `/events`,
          icon: "/icon-192x192.png",
          read: false,
          createdAt: serverTimestamp(),
        });
      }
      
      console.log("✅ Event RSVP saved to Firestore");
      return NextResponse.json({ ok: true, message: "RSVP confirmed." });
    } catch (firestoreError) {
      console.error("❌ Firestore save failed:", String(firestoreError));
      return NextResponse.json(
        { 
          ok: false, 
          message: "Failed to save RSVP. Please check your database connection.",
          error: String(firestoreError)
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("event rsvp error", error);
    return NextResponse.json(
      { ok: false, message: "Unable to RSVP.", error: String(error) },
      { status: 500 },
    );
  }
}
