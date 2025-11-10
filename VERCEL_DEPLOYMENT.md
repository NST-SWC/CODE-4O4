# 🚀 Vercel Deployment Guide

## Quick Setup

### Option 1: Import from GitHub (Recommended)

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Add Firebase configuration"
   git push origin main
   ```

2. **Go to Vercel:**
   - Visit https://vercel.com
   - Click "Add New Project"
   - Import your GitHub repository: `NST-SWC/website-1`

3. **Configure Environment Variables:**
   Click on "Environment Variables" and add these:

   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=<your_real_api_key>
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=nst-swc1.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=nst-swc1
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=nst-swc1.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<your_sender_id>
   NEXT_PUBLIC_FIREBASE_APP_ID=<your_app_id>
   FIREBASE_PROJECT_ID=nst-swc1
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@nst-swc1.iam.gserviceaccount.com
   FIREBASE_SERVICE_ACCOUNT=<paste_entire_json_as_one_line>
   ```

4. **Click Deploy!**

### Option 2: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# For production
vercel --prod
```

## 📝 Adding Environment Variables

### Method 1: During Project Setup
- Paste each variable when creating the project
- ✅ Applied to all environments (Production, Preview, Development)

### Method 2: After Deployment
1. Go to your project on Vercel Dashboard
2. Click **Settings** → **Environment Variables**
3. Add each variable:
   - **Name:** Variable name (e.g., `NEXT_PUBLIC_FIREBASE_API_KEY`)
   - **Value:** The actual value
   - **Environment:** Select all (Production, Preview, Development)
4. Click **Save**
5. **Redeploy** your project for changes to take effect

### Method 3: Using .env File Reference
You can copy all variables from the `.env` file in this project:
- See `.env` file for the complete list
- ⚠️ Make sure to get real API keys from Firebase Console first!

## 🔑 Getting Firebase Service Account JSON for Vercel

The `FIREBASE_SERVICE_ACCOUNT` needs to be a **single-line JSON string**:

### Step 1: Copy the Service Account File
```bash
# This creates a single-line version
cat nst-swc1-firebase-adminsdk-fbsvc-f4148b8fbc.json | jq -c .
```

Or manually:
1. Open `nst-swc1-firebase-adminsdk-fbsvc-f4148b8fbc.json`
2. Copy the entire content
3. Remove all line breaks (make it one line)
4. Paste into Vercel environment variable

### Step 2: The JSON should look like:
```json
{"type":"service_account","project_id":"nst-swc1",...}
```

## 🔒 Security Best Practices

### Client-Side Variables (Safe to Expose)
These start with `NEXT_PUBLIC_` and are safe in the browser:
- ✅ `NEXT_PUBLIC_FIREBASE_API_KEY`
- ✅ `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- ✅ `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- ✅ `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- ✅ `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- ✅ `NEXT_PUBLIC_FIREBASE_APP_ID`

### Server-Side Variables (Keep Secret)
Never expose these in client-side code:
- 🔒 `FIREBASE_SERVICE_ACCOUNT`
- 🔒 `FIREBASE_PROJECT_ID`
- 🔒 `FIREBASE_CLIENT_EMAIL`

## ⚙️ Vercel Configuration

The `vercel.json` file is already configured (if you created one). Otherwise Vercel auto-detects Next.js.

### Build Settings:
- **Framework Preset:** Next.js
- **Build Command:** `npm run build` (default)
- **Output Directory:** `.next` (default)
- **Install Command:** `npm install` (default)

## 🔥 Update Firestore Rules for Production

Once deployed, update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Members collection - authenticated users can read
    match /members/{memberId} {
      allow read: if true; // Public read
      allow write: if request.auth != null; // Authenticated write
    }
    
    // Pending members - anyone can create (join requests)
    match /pendingMembers/{id} {
      allow read: if request.auth != null;
      allow create: if true;
      allow update, delete: if false; // Only through admin SDK
    }
    
    // Projects - public read, members can write
    match /projects/{projectId} {
      allow read: if true;
      allow create, update: if request.auth != null;
      allow delete: if false;
    }
    
    // Project interests - authenticated users
    match /projectInterests/{id} {
      allow read, create: if request.auth != null;
      allow update, delete: if false; // Only through admin SDK
    }
    
    // Project members - read only from client
    match /projectMembers/{id} {
      allow read: if true;
      allow write: if false; // Only through admin SDK
    }
    
    // Admin decisions - read only, no client writes
    match /adminDecisions/{id} {
      allow read: if request.auth != null;
      allow write: if false; // Only through admin SDK
    }
  }
}
```

## 🧪 Testing Deployment

After deployment:

1. **Check Environment Variables:**
   ```bash
   # In Vercel deployment logs
   # Should see: ✓ Environments: .env.local
   ```

2. **Test Firebase Connection:**
   - Visit your deployed URL
   - Check browser console for errors
   - Try joining the club (creates `pendingMembers` doc)
   - Check Firebase Console for the new document

3. **Test Admin Functions:**
   - Visit `/admin` on deployed site
   - Should see pending members and project interests
   - Try approving a member

## 🐛 Troubleshooting

### Build Fails
**Error:** "Module not found"
**Solution:** 
- Check that service account file path is correct
- Use `FIREBASE_SERVICE_ACCOUNT` env var instead of file in production

### Firebase "Permission Denied"
**Error:** "Missing or insufficient permissions"
**Solution:**
- Update Firestore rules (see above)
- Verify `FIREBASE_SERVICE_ACCOUNT` is correctly set

### Environment Variables Not Working
**Solution:**
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Verify all variables are added
3. **Redeploy** the project (important!)
4. Check deployment logs

### API Routes Return 500
**Solution:**
1. Check deployment logs for error details
2. Verify `FIREBASE_SERVICE_ACCOUNT` format (single-line JSON)
3. Ensure Firestore is enabled in Firebase Console
4. Check Firestore rules allow server-side access

## 📊 Monitoring

### Vercel Analytics
- Enable in Project Settings → Analytics
- Track performance and errors

### Firebase Console
- Monitor database usage: Firestore → Usage
- Check API requests: Project Settings → Usage

### Logs
- Vercel Logs: Deployment → View Function Logs
- Firebase Logs: Cloud Logging (if using Cloud Functions)

## 🔄 Continuous Deployment

Once connected to GitHub:
- ✅ Auto-deploys on push to `main` branch
- ✅ Preview deployments for pull requests
- ✅ Automatic HTTPS certificates
- ✅ Global CDN distribution

### Deploy on Push:
```bash
git add .
git commit -m "Update feature"
git push origin main
# Vercel automatically deploys!
```

## 📱 Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Vercel handles HTTPS automatically

---

## Quick Reference

**Vercel Dashboard:** https://vercel.com/dashboard
**Project URL:** Check after deployment
**Firebase Console:** https://console.firebase.google.com/project/nst-swc1

**Environment Variables File:** See `.env` in project root
**Firebase Setup:** See `GET_FIREBASE_CREDENTIALS.md`
**Collections Guide:** See `COLLECTIONS_GUIDE.md`

Need help? Check Vercel docs: https://vercel.com/docs
