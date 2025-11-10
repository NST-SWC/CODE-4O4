import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import type { ServiceAccount } from "firebase-admin";

let adminApp: App | null = null;

const getServiceAccount = (): ServiceAccount | null => {
  // First, try to get service account from environment variable (JSON string)
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      const parsed = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      console.log("Using FIREBASE_SERVICE_ACCOUNT from environment");
      return {
        projectId: parsed.project_id,
        privateKey: parsed.private_key,
        clientEmail: parsed.client_email,
      } as ServiceAccount;
    } catch (error) {
      console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT:", error);
    }
  }
  
  // Fallback: construct from individual environment variables
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  
  if (projectId && clientEmail && privateKey) {
    console.log("Using individual Firebase environment variables");
    return {
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, '\n'), // Handle escaped newlines
    } as ServiceAccount;
  }
  
  console.error("❌ No Firebase credentials found in environment variables");
  console.error("Please set FIREBASE_SERVICE_ACCOUNT or individual variables");
  return null;
};

export const getAdminApp = () => {
  try {
    if (adminApp) {
      console.log("Using existing admin app");
      return adminApp;
    }
    if (getApps().length) {
      console.log("Using existing Firebase app from getApps()");
      adminApp = getApps()[0]!;
      return adminApp;
    }
    console.log("Initializing new Firebase admin app...");
    const credentials = getServiceAccount();
    if (!credentials) {
      throw new Error("Missing Firebase service account credentials");
    }
    console.log("Service account loaded, project:", credentials.projectId);
    adminApp = initializeApp({
      credential: cert(credentials),
    });
    console.log("Firebase admin app initialized successfully");
    return adminApp;
  } catch (error) {
    console.error("Failed to get/initialize Firebase admin app:", error);
    throw error;
  }
};

export const getDb = () => {
  try {
    const app = getAdminApp();
    const db = getFirestore(app);
    console.log("Firestore instance obtained");
    return db;
  } catch (error) {
    console.error("Failed to get Firestore instance:", error);
    throw error;
  }
};
export const serverTimestamp = FieldValue.serverTimestamp;
