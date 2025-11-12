# ✅ Setup Checklist - Web App Integrations & Notifications

Use this checklist to ensure everything is properly configured.

## 🔥 Firebase Configuration

- [ ] Firebase project created (nst-swc1)
- [ ] Cloud Messaging enabled in Firebase Console
- [ ] VAPID key generated from Firebase Console
- [ ] Service account credentials configured
- [ ] Firestore database enabled

## 📝 Environment Variables

Check your `.env.local` file has all these variables:

```env
# Firebase Client Config
- [ ] NEXT_PUBLIC_FIREBASE_API_KEY
- [ ] NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- [ ] NEXT_PUBLIC_FIREBASE_PROJECT_ID
- [ ] NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- [ ] NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- [ ] NEXT_PUBLIC_FIREBASE_APP_ID

# Firebase Admin Config
- [ ] FIREBASE_PROJECT_ID
- [ ] FIREBASE_CLIENT_EMAIL
- [ ] FIREBASE_PRIVATE_KEY
- [ ] FIREBASE_SERVICE_ACCOUNT

# Notifications (NEW!)
- [ ] NEXT_PUBLIC_FIREBASE_VAPID_KEY

# Email (Optional)
- [ ] SMTP_HOST
- [ ] SMTP_PORT
- [ ] SMTP_USER
- [ ] SMTP_PASS
```

## 📦 Dependencies

Run `npm install` to ensure all packages are installed:

- [ ] firebase (v12.5.0+)
- [ ] firebase-admin (v13.6.0+)
- [ ] next (v16.0.1+)
- [ ] framer-motion
- [ ] lucide-react

## 🗂️ File Structure

Verify these files exist:

### Core Files
- [ ] `src/lib/notifications.ts`
- [ ] `src/lib/firebase/client.ts` (updated)
- [ ] `src/lib/firebase/admin.ts` (updated)

### UI Components
- [ ] `src/components/notifications/notification-bell.tsx`
- [ ] `src/components/shared/navbar.tsx` (updated)

### API Routes
- [ ] `src/app/api/notifications/route.ts`
- [ ] `src/app/api/notifications/subscribe/route.ts`
- [ ] `src/app/api/notifications/unsubscribe/route.ts`
- [ ] `src/app/api/notifications/preferences/route.ts`
- [ ] `src/app/api/notifications/send/route.ts`

### Updated API Routes
- [ ] `src/app/api/event-rsvp/route.ts` (updated)
- [ ] `src/app/api/project-interest/route.ts` (updated)
- [ ] `src/app/api/admin/decision/route.ts` (updated)

### PWA Files
- [ ] `public/firebase-messaging-sw.js`
- [ ] `public/manifest.json`
- [ ] `public/icon-512x512.svg`

### Configuration
- [ ] `next.config.ts` (updated)
- [ ] `src/app/layout.tsx` (updated)
- [ ] `package.json` (updated with test script)

### Documentation
- [ ] `NOTIFICATION_SYSTEM.md`
- [ ] `NOTIFICATIONS_QUICK_START.md`
- [ ] `IMPLEMENTATION_COMPLETE.md`
- [ ] `README.md` (updated)

### Scripts
- [ ] `scripts/test-notifications.js`

## 🧪 Testing

### Before Testing
- [ ] `npm install` completed successfully
- [ ] `.env.local` configured with all variables
- [ ] Dev server started: `npm run dev`

### User Flow Testing
- [ ] Can access app at `http://localhost:3000`
- [ ] Can log in with test credentials
- [ ] Notification bell appears in navbar
- [ ] Can click bell to open dropdown
- [ ] "Enable Notifications" button appears
- [ ] Browser prompts for notification permission
- [ ] Permission granted successfully
- [ ] FCM token generated (check console)

### Notification Testing
- [ ] RSVP to event → receive confirmation notification
- [ ] Express project interest → receive confirmation
- [ ] Project owner receives interest notification
- [ ] Admin approval → new member receives welcome
- [ ] Notifications appear in bell dropdown
- [ ] Unread count updates correctly
- [ ] Can click notification to navigate
- [ ] Can mark notification as read
- [ ] Can mark all as read

### Background Testing
- [ ] Minimize browser/switch to another tab
- [ ] Trigger notification (have someone RSVP, etc.)
- [ ] Background notification appears
- [ ] Click notification → app opens and navigates

### PWA Testing
- [ ] Manifest loads at `/manifest.json`
- [ ] Can install app (look for install prompt)
- [ ] App installs successfully
- [ ] App icon appears on home screen/desktop
- [ ] Can launch as standalone app
- [ ] Notifications work in installed PWA

### API Testing
Run the test script:
```bash
- [ ] npm run test:notifications
```

Expected output:
- [ ] ✅ Service account parsed
- [ ] ✅ Firebase Admin initialized
- [ ] ✅ Found members with FCM tokens
- [ ] ✅ Test notification sent
- [ ] ✅ Notification stored in database
- [ ] ✅ Notification history retrieved

## 🔍 Verification

### Browser DevTools Checks

#### Console Tab
- [ ] No Firebase initialization errors
- [ ] FCM token logged (starts with "FCM Token:")
- [ ] No service worker errors

#### Application Tab → Service Workers
- [ ] `firebase-messaging-sw.js` registered
- [ ] Status: "activated and running"
- [ ] Scope: "/" or site URL

#### Application Tab → Manifest
- [ ] Manifest loads without errors
- [ ] Icons display correctly
- [ ] Theme color shows as cyan (#06b6d4)

#### Network Tab
- [ ] `/manifest.json` loads (200 OK)
- [ ] `/firebase-messaging-sw.js` loads (200 OK)
- [ ] FCM API calls successful

### Firestore Verification

Check these collections in Firebase Console:

#### members collection
- [ ] `fcmTokens` array exists on user documents
- [ ] `notificationPreferences` object exists
- [ ] Tokens look valid (long string starting with various characters)

#### notifications collection
- [ ] Test notifications stored
- [ ] Have correct structure (userId, title, body, url, read, createdAt)
- [ ] Timestamps are recent

#### notificationSubscriptions collection
- [ ] Subscription records exist
- [ ] Have userId and token
- [ ] `active` field is true

## 🚨 Common Issues & Solutions

### Issue: "Permission denied"
- [ ] Check browser settings allow notifications
- [ ] Try incognito/private window
- [ ] Clear browser cache and reload

### Issue: "No FCM token"
- [ ] Verify VAPID key in `.env.local`
- [ ] Check Firebase Console → Cloud Messaging enabled
- [ ] Restart dev server

### Issue: "Service worker not found"
- [ ] Check file exists: `public/firebase-messaging-sw.js`
- [ ] Verify file has correct Firebase config
- [ ] Hard refresh browser (Ctrl+Shift+R)

### Issue: "Notifications not appearing"
- [ ] Check Notification permission status
- [ ] Verify FCM token exists in Firestore
- [ ] Check browser console for errors
- [ ] Try sending test notification from script

### Issue: "Background notifications not working"
- [ ] Service worker must be registered
- [ ] HTTPS required (localhost is OK for dev)
- [ ] Check service worker console for errors

## 🎉 Launch Checklist

Before going live:

### Production Setup
- [ ] Add VAPID key to production environment variables
- [ ] Add all Firebase credentials to production env
- [ ] Update service worker with production URLs
- [ ] Test on production domain (HTTPS required)
- [ ] Verify service worker loads over HTTPS

### User Communication
- [ ] Create announcement about new notification feature
- [ ] Add tutorial/guide for enabling notifications
- [ ] Send email to existing members
- [ ] Update onboarding flow for new members

### Monitoring
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Monitor FCM delivery reports
- [ ] Track notification opt-in rates
- [ ] Monitor click-through rates

### Documentation
- [ ] Share docs with team
- [ ] Create admin guide for sending notifications
- [ ] Document best practices for notification content
- [ ] Set up FAQ for common issues

## 📊 Success Metrics

After launch, track:

- [ ] Notification opt-in rate (target: >50%)
- [ ] Notification delivery rate (target: >95%)
- [ ] Click-through rate (target: >20%)
- [ ] PWA installation rate (target: >10%)
- [ ] User satisfaction scores
- [ ] Support tickets related to notifications

---

## ✅ Final Verification

All systems go? Check all boxes above, then:

```bash
# Run final tests
npm run lint
npm run build
npm run test:notifications

# If all pass:
🎉 Ready to launch! 🚀
```

---

**Last Updated**: November 2025
**Need Help?** Refer to NOTIFICATION_SYSTEM.md or contact the dev team.
