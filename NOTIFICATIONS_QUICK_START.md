# 🔔 Quick Start: Enable Notifications

## For Users (Members)

### 1. Enable Notifications in the App

1. Log in to the portal at `http://localhost:3000` (or your deployment URL)
2. Look for the **bell icon** 🔔 in the top navigation bar
3. Click the bell to open the notification dropdown
4. Click the **"Enable Notifications"** button
5. When your browser asks for permission, click **"Allow"**

✅ You're now subscribed to notifications!

### 2. Test Your Notifications

Try one of these actions to receive a notification:

- **RSVP to an event** → Get confirmation notification
- **Express interest in a project** → Get confirmation notification
- **Wait for admin approval** → Get welcome notification

### 3. View Your Notifications

- Click the bell icon to see all your notifications
- Unread notifications are highlighted
- Click a notification to navigate to the relevant page
- Use "Mark all as read" to clear unread count

---

## For Developers

### 1. Add VAPID Key

Get your VAPID key from Firebase:
1. Go to [Firebase Console](https://console.firebase.google.com/project/nst-swc1/settings/cloudmessaging)
2. Under "Web Push certificates", click "Generate key pair"
3. Copy the key

Add to `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_VAPID_KEY=YOUR_VAPID_KEY_HERE
```

### 2. Test the System

```bash
# Install dependencies (if not already done)
npm install

# Start the dev server
npm run dev

# In another terminal, run the test script
npm run test:notifications
```

### 3. Send Test Notification

Use the API endpoint:

```bash
curl -X POST http://localhost:3000/api/notifications/send \
  -H "Content-Type: application/json" \
  -H "Cookie: code404-user={\"id\":\"admin-id\",\"role\":\"admin\"}" \
  -d '{
    "userId": "USER_ID_HERE",
    "title": "Test Notification",
    "body": "This is a test from the API",
    "url": "/dashboard"
  }'
```

### 4. Check Service Worker

1. Open Chrome DevTools (F12)
2. Go to **Application** tab
3. Click **Service Workers** in the left sidebar
4. You should see `firebase-messaging-sw.js` registered

### 5. Debug Notifications

```javascript
// In browser console:

// Check permission
console.log('Permission:', Notification.permission);

// Check if FCM is initialized
console.log('FCM available:', !!firebase?.messaging);

// Get current token
// (This will prompt for permission if not granted)
```

---

## For Admins

### Send Notification to All Members

```bash
POST /api/notifications/send
Authorization: Admin Cookie Required

{
  "topic": "all-members",
  "title": "Important Announcement",
  "body": "Check out our new workshop this Friday!",
  "url": "/events"
}
```

### Send to Specific Users

```bash
{
  "userIds": ["user-1", "user-2", "user-3"],
  "title": "Personal Message",
  "body": "You've been selected for the project",
  "url": "/projects"
}
```

---

## Common Issues

### "Notification permission denied"
**Solution**: User must manually re-enable in browser settings
- Chrome: `chrome://settings/content/notifications`
- Firefox: `about:preferences#privacy` → Permissions → Notifications

### "No FCM token generated"
**Solution**: Check VAPID key is set correctly in `.env.local`

### "Service worker not registered"
**Solution**: 
1. Check `public/firebase-messaging-sw.js` exists
2. Restart dev server: `npm run dev`
3. Clear browser cache and reload

### Notifications not appearing on iOS
**Solution**: Install as PWA (Add to Home Screen)
- iOS Safari has limited notification support
- PWA installation enables full notification features

---

## Next Steps

1. ✅ Enable notifications
2. 📱 Install as PWA for better experience
3. ⚙️ Customize preferences in settings
4. 📚 Read full docs: [NOTIFICATION_SYSTEM.md](./NOTIFICATION_SYSTEM.md)

---

**Need Help?** Check the full documentation or contact the dev team.
