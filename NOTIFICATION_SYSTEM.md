# 🔔 Notification System Setup Guide

## Overview

The NST Dev Club portal now includes a comprehensive push notification system powered by Firebase Cloud Messaging (FCM). Members receive real-time notifications for:

- **Event RSVPs** - Confirmation when you register for events
- **Project Interest** - Updates when someone shows interest in your project
- **Admin Decisions** - Approval notifications for club membership
- **Custom Notifications** - Admin-sent announcements and updates

## 🚀 Features

### ✨ Current Features

- ✅ Push notifications via Firebase Cloud Messaging
- ✅ In-app notification bell with unread count
- ✅ Notification history with read/unread status
- ✅ Service worker for background notifications
- ✅ Click-to-navigate functionality
- ✅ PWA (Progressive Web App) support
- ✅ Notification preferences per user
- ✅ Multi-device support
- ✅ Admin notification sending

### 📱 PWA Features

- Install as app on mobile/desktop
- Offline notification queue
- App shortcuts for quick navigation
- Custom app icons and splash screen

## 🔧 Setup Instructions

### 1. Enable Firebase Cloud Messaging

1. Go to [Firebase Console](https://console.firebase.google.com/project/nst-swc1)
2. Navigate to **Project Settings** > **Cloud Messaging**
3. Under **Web Push certificates**, generate a new VAPID key pair
4. Copy the VAPID key

### 2. Add VAPID Key to Environment

Add to your `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_VAPID_KEY=YOUR_VAPID_KEY_HERE
```

### 3. Update Service Worker Config

The service worker (`public/firebase-messaging-sw.js`) is already configured with your Firebase credentials. If you change Firebase projects, update:

```javascript
firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
});
```

### 4. Test Notifications

Run the development server:

```bash
npm run dev
```

1. Visit `http://localhost:3000`
2. Log in as a user
3. Click "Enable Notifications" in the notification bell dropdown
4. Grant permission when prompted
5. Test by RSVPing to an event or expressing interest in a project

## 📡 API Endpoints

### Subscribe to Notifications

```bash
POST /api/notifications/subscribe
Content-Type: application/json

{
  "userId": "user-123",
  "token": "fcm-token-here"
}
```

### Send Notification (Admin Only)

```bash
POST /api/notifications/send
Content-Type: application/json

{
  "userId": "user-123",  # or userIds: ["user-1", "user-2"]
  "title": "New Event!",
  "body": "Check out our latest workshop",
  "url": "/events",
  "icon": "/icon-192x192.png"
}
```

### Get User Notifications

```bash
GET /api/notifications?userId=user-123&limit=20&unreadOnly=false
```

### Mark as Read

```bash
PATCH /api/notifications
Content-Type: application/json

{
  "userId": "user-123",
  "notificationIds": ["notif-1", "notif-2"]
}

# Or mark all as read:
{
  "userId": "user-123",
  "markAllAsRead": true
}
```

### Update Preferences

```bash
PATCH /api/notifications/preferences
Content-Type: application/json

{
  "userId": "user-123",
  "preferences": {
    "events": true,
    "projects": true,
    "admin": true,
    "email": false
  }
}
```

## 🎨 UI Components

### Notification Bell

The notification bell is automatically included in the navbar. It displays:

- Unread notification count (badge)
- Dropdown with recent notifications
- "Enable Notifications" prompt (if permission not granted)
- "Mark all as read" button
- Link to notification settings

### Using in Your Components

```tsx
import NotificationBell from "@/components/notifications/notification-bell";

// Already included in Navbar component
<NotificationBell />
```

## 💻 Programmatic Usage

### Request Permission

```typescript
import { subscribeToNotifications } from "@/lib/notifications";

const userId = "user-123";
const success = await subscribeToNotifications(userId);
if (success) {
  console.log("Subscribed to notifications!");
}
```

### Listen for Foreground Messages

```typescript
import { onForegroundMessage } from "@/lib/notifications";

const unsubscribe = onForegroundMessage((payload) => {
  console.log("Received message:", payload);
  // Handle the notification
});

// Clean up when component unmounts
return () => {
  if (unsubscribe) unsubscribe();
};
```

### Show Custom Notification

```typescript
import { showNotification } from "@/lib/notifications";

await showNotification({
  title: "Hello!",
  body: "This is a test notification",
  url: "/dashboard",
  icon: "/icon-192x192.png",
});
```

## 🔐 Security & Permissions

### Notification Permission Flow

1. User logs in to the portal
2. Notification bell appears in navbar
3. User clicks bell → sees "Enable Notifications" button
4. User clicks button → browser prompts for permission
5. If granted → FCM token generated and saved to Firestore
6. Token stored in `members` collection under `fcmTokens` array

### Database Structure

```typescript
// Members collection
{
  id: "user-123",
  name: "John Doe",
  email: "john@example.com",
  fcmTokens: ["token-1", "token-2"], // Multiple devices
  notificationPreferences: {
    events: true,
    projects: true,
    admin: true,
    email: true
  }
}

// Notifications collection
{
  id: "notif-123",
  userId: "user-123",
  title: "Event RSVP Confirmed",
  body: "You're registered for React Workshop",
  url: "/events",
  icon: "/icon-192x192.png",
  read: false,
  createdAt: Timestamp
}

// NotificationSubscriptions collection
{
  id: "token-abc123",
  userId: "user-123",
  token: "fcm-token-abc123",
  subscribedAt: Timestamp,
  active: true
}
```

## 📱 PWA Installation

### Install on Mobile (iOS/Android)

1. Visit the site in Safari (iOS) or Chrome (Android)
2. Tap the share/menu button
3. Select "Add to Home Screen"
4. App icon appears on home screen
5. Launch like a native app

### Install on Desktop

1. Visit the site in Chrome/Edge
2. Look for install icon in address bar
3. Click "Install"
4. App opens in standalone window

## 🧪 Testing

### Manual Testing Checklist

- [ ] Enable notifications permission
- [ ] RSVP to an event → receive confirmation
- [ ] Express interest in a project → receive confirmation
- [ ] Project owner receives notification of interest
- [ ] Admin approves member → member receives welcome notification
- [ ] Click notification → navigates to correct page
- [ ] Notification appears in bell dropdown
- [ ] Unread count updates correctly
- [ ] Mark as read works
- [ ] Mark all as read works
- [ ] Background notifications work when tab not focused
- [ ] Install as PWA
- [ ] Receive notifications while PWA installed

### Testing with curl

```bash
# Send test notification (requires admin auth)
curl -X POST http://localhost:3000/api/notifications/send \
  -H "Content-Type: application/json" \
  -H "Cookie: code404-user=..." \
  -d '{
    "userId": "user-123",
    "title": "Test Notification",
    "body": "This is a test",
    "url": "/dashboard"
  }'
```

## 🎯 Notification Triggers

Notifications are automatically sent for:

### 1. Event RSVP
- **Trigger**: User RSVPs to an event
- **Recipient**: The user who RSVPed
- **Action**: Confirmation notification with event details

### 2. Project Interest
- **Trigger**: User expresses interest in a project
- **Recipients**: 
  - User: Confirmation notification
  - Project owner: New interest notification

### 3. Admin Decision
- **Trigger**: Admin approves/rejects membership
- **Recipient**: The pending member
- **Action**: Approval or status update notification

### 4. Custom (Admin)
- **Trigger**: Admin sends notification via API
- **Recipients**: Specific users or topics
- **Action**: Custom message

## 🐛 Troubleshooting

### Notifications Not Appearing

1. **Check permission status**:
   ```javascript
   console.log(Notification.permission); // Should be "granted"
   ```

2. **Verify FCM token**:
   ```javascript
   // Check browser console for "FCM Token: ..."
   ```

3. **Check service worker registration**:
   ```javascript
   navigator.serviceWorker.getRegistration().then(reg => {
     console.log('SW registered:', reg);
   });
   ```

4. **Inspect Firestore**:
   - Check `members` collection for `fcmTokens` array
   - Check `notifications` collection for stored notifications

### Service Worker Issues

```bash
# Clear service worker cache
# Chrome DevTools > Application > Service Workers > Unregister
```

### VAPID Key Errors

Error: `Messaging: We are unable to register the default service worker...`

**Solution**: Add VAPID key to `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_VAPID_KEY=YOUR_KEY_HERE
```

## 📚 Additional Resources

- [Firebase Cloud Messaging Documentation](https://firebase.google.com/docs/cloud-messaging)
- [Web Push Notifications Guide](https://web.dev/push-notifications-overview/)
- [Service Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [PWA Documentation](https://web.dev/progressive-web-apps/)

## 🔜 Future Enhancements

- [ ] Email notification fallback
- [ ] SMS notifications for critical updates
- [ ] Notification scheduling
- [ ] Rich media notifications (images, actions)
- [ ] Notification grouping
- [ ] Do Not Disturb mode
- [ ] Notification analytics dashboard
- [ ] Topic-based subscriptions (events, projects, announcements)

## 📝 Notes

- Notifications require HTTPS in production (localhost works for development)
- FCM tokens can expire - app automatically refreshes them
- Background notifications work even when browser/app is closed
- iOS Safari has limitations - PWA install recommended for best experience
- Maximum payload size: 4KB per notification

---

**Last Updated**: November 2025
**Maintained By**: NST Dev Club Team
