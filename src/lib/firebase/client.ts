import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import type { FirebaseOptions } from "firebase/app";
import { getMessaging, type Messaging } from "firebase/messaging";

const firebaseConfig: FirebaseOptions | null =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
  process.env.NEXT_PUBLIC_FIREBASE_APP_ID
    ? {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
      }
    : null;

export const hasFirebaseConfig = Boolean(firebaseConfig);

export const getFirebaseApp = (): FirebaseApp | null => {
  if (!firebaseConfig) return null;
  if (typeof window === "undefined") return null;
  if (getApps().length > 0) {
    return getApps()[0]!;
  }
  return initializeApp(firebaseConfig);
};

export const getFirebaseMessaging = (): Messaging | null => {
  try {
    const app = getFirebaseApp();
    if (!app) return null;
    if (typeof window === "undefined") return null;
    return getMessaging(app);
  } catch (error) {
    console.error("Error initializing Firebase Messaging:", error);
    return null;
  }
};
