import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import type { ServiceAccount } from "firebase-admin";

import serviceAccountJson from "../../../nst-swc1-firebase-adminsdk-fbsvc-79850ecef3.json";

let adminApp: App | null = null;

const getServiceAccount = (): ServiceAccount | null => {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) as ServiceAccount;
    } catch (error) {
      console.warn("Failed to parse FIREBASE_SERVICE_ACCOUNT env", error);
    }
  }
  return (serviceAccountJson as ServiceAccount) ?? null;
};

export const getAdminApp = () => {
  if (adminApp) return adminApp;
  if (getApps().length) {
    adminApp = getApps()[0]!;
    return adminApp;
  }
  const credentials = getServiceAccount();
  if (!credentials) {
    throw new Error("Missing Firebase service account credentials");
  }
  adminApp = initializeApp({
    credential: cert(credentials),
  });
  return adminApp;
};

export const getDb = () => getFirestore(getAdminApp());
export const serverTimestamp = FieldValue.serverTimestamp;
