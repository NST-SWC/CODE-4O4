/* Service Worker: public/sw.js
   Handles 'push' and 'notificationclick' events for Web Push.
*/
/* eslint-disable no-restricted-globals */
self.addEventListener('install', (event) => {
  // Activate immediately so we can claim clients and avoid stale caches
  // Note: clients may get refreshed when controllerchange fires on the page
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Take control of all pages under scope immediately
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  try {
    const payload = event.data ? event.data.json() : {};
    // Provide a friendly default title
    const title = payload.title || 'DevForge';

    // NotificationOptions supported keys: body, icon, badge, image, vibrate, actions, tag, renotify, requireInteraction, silent, data
    const options = {
      body: payload.body || undefined,
  icon: payload.icon || '/app-icon-192.png',
  badge: payload.badge || '/app-icon-72.png',
      image: payload.image || undefined,
      // Vibrate pattern: array of numbers (ms). Many mobile browsers support this when device settings allow.
      vibrate: payload.vibrate || [100, 50, 100],
      data: payload.data || {},
      renotify: payload.renotify || false,
      tag: payload.tag || undefined,
      // keep notification visible until user interacts for high-priority alerts
      requireInteraction: payload.requireInteraction || false,
      // silent: true/false - note: some platforms ignore sound control and use system settings
      silent: payload.silent || false,
      // Actions: array of {action, title, icon}
      actions: payload.actions || [],
    };

    event.waitUntil(self.registration.showNotification(title, options));
  } catch (err) {
    const title = 'New notification';
    event.waitUntil(self.registration.showNotification(title, {}));
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const notificationData = event.notification.data || {};
  const clickUrl = notificationData.url || '/';

  // Handle action buttons (if any)
  const action = event.action;
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(async (clientList) => {
      // If user clicked an action, handle it specially
      if (action) {
        // Example action handlers: 'reply', 'open', 'snooze', 'mark-read'
        if (action === 'reply' && notificationData.replyUrl) {
          if (clients.openWindow) return clients.openWindow(notificationData.replyUrl);
        }
        if (action === 'snooze' && notificationData.snoozeUrl) {
          if (clients.openWindow) return clients.openWindow(notificationData.snoozeUrl);
        }
        if (action === 'mark-read' && notificationData.markReadApi) {
          // Try to call an API route (fire-and-forget)
          try {
            await fetch(notificationData.markReadApi, { method: 'POST' });
          } catch (e) {
            // ignore
          }
        }
      }

      // Otherwise, focus an existing client or open a new one
      for (const client of clientList) {
        try {
          const url = new URL(client.url);
          if (url.pathname === new URL(clickUrl, self.location.origin).pathname && 'focus' in client) {
            return client.focus();
          }
        } catch (e) {
          // ignore parsing errors
        }
      }
      if (clients.openWindow) return clients.openWindow(clickUrl);
    })
  );
});

self.addEventListener('pushsubscriptionchange', (event) => {
  // In many browsers this rarely fires in practice, but it's here for completeness.
  // Ideally the client re-subscribes and sends the new subscription to the server.
  console.log('pushsubscriptionchange', event);
});

// Basic fetch handler so browsers consider this a "network-capable" service worker.
// This keeps the implementation simple: forward requests to network by default.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  // Only handle GET requests
  if (req.method !== 'GET') return;

  // For navigation requests (page loads), use a network-first strategy with a short timeout
  if (req.mode === 'navigate') {
    const networkFirst = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout
        const response = await fetch(req, { signal: controller.signal });
        clearTimeout(timeoutId);
        return response;
      } catch (err) {
        // If network fails/timeout, fall back to cached document if any, otherwise try network again
        try {
          const cached = await caches.match(req);
          if (cached) return cached;
        } catch (e) {
          // ignore
        }
        return fetch(req).catch(() => new Response('Offline', { status: 503, statusText: 'Offline' }));
      }
    };

    event.respondWith(networkFirst());
    return;
  }

  // For other GET requests, prefer network but fall back to cache
  event.respondWith(
    fetch(req).catch(() => caches.match(req)).catch(() => fetch(req))
  );
});

// Allow clients to trigger a skipWaiting to activate this worker immediately.
self.addEventListener('message', (event) => {
  try {
    const data = event.data || {};
    if (data && data.type === 'SKIP_WAITING') {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      self.skipWaiting();
    }
  } catch (err) {
    console.warn('sw message handler error', err);
  }
});
