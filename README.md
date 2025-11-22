## NSTSWC Dev Club Portal

A smooth, neon-inspired developer club experience built with Next.js 16, Tailwind CSS v4, Framer Motion, and Firebase. The marketing homepage mirrors the provided reference while the authenticated dashboard showcases projects, events, sessions, leaderboards, and admin approvals backed by Firebase helpers.

### ✨ Highlights
- Animated hero, feature grid, and journey timeline styled with glassmorphism + glow particles.
- CTA buttons trigger fully validated modals for **Join Club** (rich application form) and **username/password login** (no Firebase Auth dependency). Successful logins now redirect to the dashboard automatically.
- Projects, events, calendar previews, leaderboard teaser, and admin queue now live on their own dedicated routes _and_ have callouts on the homepage.
- `/dashboard` route recreates the internal portal with stats, project request flows, event RSVPs, sprint calendar, leaderboard, and approval widgets.
- **🔔 Push Notifications** - Real-time notifications for events, project updates, and admin decisions via Firebase Cloud Messaging with PWA support
- Firebase helpers for join requests, project interest, and event RSVPs now POST through secure Next.js API routes that write to Firestore with the provided service account. (If you remove the sample credentials, set `FIREBASE_SERVICE_ACCOUNT` with your own JSON.)

### 🧰 Stack
- [Next.js 16 App Router](https://nextjs.org/) with TypeScript & `src/` directory.
- Tailwind CSS v4 (utility-first styling) + custom CSS variables for neon theme.
- [Framer Motion](https://www.framer.com/motion/) for modals and section animations.
- [Firebase Web SDK](https://firebase.google.com/docs/web) (Auth + Firestore helpers).
- `react-hook-form` + `zod` for robust form validation.

### 🚀 Getting Started
```bash
npm install
npm run dev
# visit http://localhost:3000
```
The dashboard lives at `http://localhost:3000/dashboard`.

### 🔑 Demo Accounts
Static credentials are baked into the client-side auth context for previews:

| Username | Password   | Role   |
|----------|------------|--------|
| `admin`  | `admin123` | Admin  |
| `mentor` | `mentor123`| Mentor |
| `member` | `member123`| Student |

Replace these with your own authentication mechanism (or connect to Firebase Auth) when deploying.

### 🔐 Firebase Setup
1. Create a Firebase project (or reuse an existing one).
2. Enable Google Auth and Firestore Database.
3. Copy the web app credentials and populate `.env.local` using the provided template:
   ```
   cp .env.local.example .env.local
   ```
4. (Optional) Instead of env vars you can drop a service account JSON at the project root (one is provided for local demo). The API routes under `src/app/api/*` all use `firebase-admin` so requests persist even without client-side Firebase config.
5. **Enable Cloud Messaging** for push notifications:
   - Go to Firebase Console > Project Settings > Cloud Messaging
   - Generate VAPID key and add to `.env.local` as `NEXT_PUBLIC_FIREBASE_VAPID_KEY`
   - See [NOTIFICATION_SYSTEM.md](./NOTIFICATION_SYSTEM.md) for complete setup guide

### 🔔 Slack Bot (Dev Club channel)
- Follow [SLACK_SETUP.md](./SLACK_SETUP.md) to configure either a webhook (`SLACK_WEBHOOK_URL`) or bot token (`SLACK_BOT_TOKEN` + channel ID) in `.env.local`.
- Post messages via `POST /api/slack/notify` (guarded by `x-slack-secret`) or from the CLI with `npm run slack:send -- \"Hello\" --url https://devclub.example.com --ping here`. The system prefers the webhook when set, falling back to the bot token.
- If Slack shows “app not configured to handle interactive responses,” enable Interactivity in Slack and point the Request URL to `/api/slack/interactive` (see SLACK_SETUP.md).

Without valid credentials, all Firebase-powered actions remain in **preview mode** (requests resolve locally so you can demo the flow without writes).

### 📁 Notable Structure
```
src/
  app/
    page.tsx             # Marketing experience (renders HomeLanding)
    dashboard/page.tsx   # Authenticated portal preview
    projects/page.tsx    # Full projects listing
    events/page.tsx      # Events-only feed
    calendar/page.tsx    # Sessions timeline
    leaderboard/page.tsx # Rankings overview
    admin/page.tsx       # Pending approvals
  components/
    home/                # Landing page sections + layout helpers
    forms/               # Join club form (react-hook-form + zod)
    modals/              # Join/Login modals with Framer Motion
    ui/                  # Reusable UI primitives (buttons, etc.)
    shared/              # Page container + intro utilities for simple routes
  context/
    auth-context.tsx     # Local username/password session state
  lib/
    data.ts              # Static preview data for cards/sections
    firebase/            # App init + Firestore helper actions
    utils.ts             # Formatting helpers
  types/                 # Shared TypeScript contracts
```

### ✅ Next Steps
1. Replace preview data with live Firestore listeners (projects/events/leaderboard).
2. Swap the static credential map with your preferred auth provider (Firebase Auth, Supabase, etc.).
3. Gate `/dashboard` and the new `/admin` route with server-side checks when deploying publicly.
4. Hook the leaderboard to a points engine stored in Firestore or RTDB.
