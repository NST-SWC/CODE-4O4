# 🔑 How to Get Your Firebase Credentials

## Current Status
✅ Service Account (Admin SDK): **Already configured**
- File: `nst-swc1-firebase-adminsdk-fbsvc-f4148b8fbc.json`
- Project ID: `nst-swc1`
- Client Email: `firebase-adminsdk-fbsvc@nst-swc1.iam.gserviceaccount.com`

⚠️ Web App (Client SDK): **Needs real API keys**

## Steps to Get Web App Credentials

### 1. Go to Firebase Console
Visit: https://console.firebase.google.com/project/nst-swc1/settings/general

### 2. Find Your Web App
- Click on **Project Settings** (gear icon ⚙️)
- Scroll down to **Your apps** section
- If you don't have a web app yet:
  1. Click **Add app** → Select **Web** (</> icon)
  2. Give it a nickname (e.g., "NST-SWC Website")
  3. Click **Register app**

### 3. Copy the Config
You'll see something like:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "nst-swc1.firebaseapp.com",
  projectId: "nst-swc1",
  storageBucket: "nst-swc1.firebasestorage.app",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xxxxxxxxxxxx",
  measurementId: "G-XXXXXXXXXX"
};
```

### 4. Update .env.local
Replace the placeholder values in `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:xxxxxxxxxxxx
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Note:** The following are already correct:
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=nst-swc1.firebaseapp.com`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID=nst-swc1`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=nst-swc1.firebasestorage.app`

### 5. Enable Services

#### A. Enable Firestore Database
1. Go to **Firestore Database** in the left menu
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select a location (closest to your users)
5. Click **Enable**

#### B. Enable Authentication (Optional, if using Firebase Auth)
1. Go to **Authentication** in the left menu
2. Click **Get started**
3. Enable sign-in methods you want:
   - Email/Password
   - Google
   - GitHub
   etc.

### 6. Set Firestore Rules
Go to **Firestore Database** → **Rules** tab:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow all access for development
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **Important:** These rules are for development only! Update for production.

### 7. Test Connection
After updating `.env.local`:

```bash
# Restart your dev server
npm run dev

# In another terminal, run the seed script
npx ts-node scripts/seed-firebase.ts
```

You should see:
```
✅ 4 members added
✅ 2 pending members added
✅ 3 projects added
✅ 3 project interests added
✅ 4 project members added
✅ Firebase is connected and working!
```

## Verification Checklist

- [ ] Got Web App config from Firebase Console
- [ ] Updated all `NEXT_PUBLIC_FIREBASE_*` variables in `.env.local`
- [ ] Firestore Database is enabled
- [ ] Firestore rules are set to test mode
- [ ] Restarted dev server (`npm run dev`)
- [ ] Ran seed script successfully
- [ ] Can see data in Firebase Console → Firestore Database
- [ ] No more "UNAUTHENTICATED" errors in terminal

## Need Help?

### Common Issues

**Problem:** "UNAUTHENTICATED" error
**Solution:** 
1. Make sure Firestore is enabled
2. Check Firestore rules allow access
3. Verify service account file exists and is correct

**Problem:** "Module not found" for service account JSON
**Solution:**
1. Ensure `nst-swc1-firebase-adminsdk-fbsvc-f4148b8fbc.json` exists in project root
2. Check path in `src/lib/firebase/admin.ts`

**Problem:** Client-side Firebase not connecting
**Solution:**
1. Update `.env.local` with real API keys from Firebase Console
2. Restart dev server
3. Clear browser cache

## Production Deployment

For Vercel/Netlify:

1. Add all environment variables to your deployment platform
2. For the service account, either:
   - Option A: Upload the JSON file (not recommended)
   - Option B: Store as single environment variable:
     ```
     FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"nst-swc1",...}
     ```
3. Update Firestore rules for production security
4. Enable App Check for additional security

---

**Current Project:** nst-swc1
**Service Account Email:** firebase-adminsdk-fbsvc@nst-swc1.iam.gserviceaccount.com
**Console:** https://console.firebase.google.com/project/nst-swc1
