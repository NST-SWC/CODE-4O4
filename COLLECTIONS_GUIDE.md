# Complete Firebase & Collections Guide

## 🔥 Current Error: UNAUTHENTICATED

The service account key doesn't have proper permissions. Follow these steps:

### Step 1: Fix Service Account Key

1. Go to https://console.firebase.google.com/
2. Select project **nst-swc1**
3. Click ⚙️ → **Project settings** → **Service accounts**
4. Click **Generate new private key**
5. Download and replace your current JSON file

### Step 2: Enable Firestore & Set Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // DEV ONLY!
    }
  }
}
```

### Step 3: Run Seed Script

```bash
npx ts-node scripts/seed-firebase.ts
```

## 📊 Complete Collections Structure

### 1. **pendingMembers** (Club join requests)
- User submits "Join Club" form
- Admin sees in `/admin` → "Club Member Requests" tab
- On approve → moves to `members` collection
- On reject → deleted from `pendingMembers`

### 2. **members** (Approved club members)
- Contains all approved members
- Includes: name, email, role, points, badges, avatar
- Created when admin approves from `pendingMembers`

### 3. **projects** (All club projects)
- Project details: title, description, tech stack
- Has `ownerId` field for permission checking
- Visible to all members in dashboard

### 4. **projectInterests** (Project join requests)
- User clicks "Request to Join" on a project
- **Visible to:**
  - **Admins**: See ALL requests in `/admin`
  - **Project Owners**: See only THEIR project's requests in `/dashboard/projects/[id]/manage`
- On approve → moves to `projectMembers` + deleted from `projectInterests`
- On reject → deleted from `projectInterests`

### 5. **projectMembers** (Approved project members)
- Contains userId, projectId, role, joinedAt
- Created when owner/admin approves from `projectInterests`
- Used to display team members on project pages

### 6. **adminDecisions** (Audit trail)
- Logs all approval/rejection decisions
- Tracks: who decided, when, what action
- Used for accountability and history

## 🔐 Permission System

### Admin Access (role: "admin")
- `/admin` page shows:
  - Tab 1: **All** pending club member requests (`pendingMembers`)
  - Tab 2: **All** project join requests (`projectInterests`) across all projects
- Can approve/reject ANY project interest
- Can approve/reject ANY club member request

### Project Owner Access
- `/dashboard/projects/[projectId]/manage` shows:
  - Only project interests for THEIR specific project
  - Filtered by: `projectInterests.where('projectId', '==', userId)`
- Can only approve/reject for their own projects
- Cannot see other projects' interests

### Regular Member Access
- Can view all projects
- Can click "Request to Join" to create `projectInterest`
- Can see own dashboard with joined projects

## 🧪 Test Data

The seed script creates:
- 4 members (Geetansh=admin, Utsav, Priya, Rahul)
- 2 pending members (Amit, Sneha)
- 3 projects (AI Tutor, Campus Connect, Blockchain Voting)
- 3 project interests (pending requests)
- 4 project members (approved memberships)

## 📝 Workflow Examples

### Example 1: New User Joins Club
1. User fills form on home page → creates `pendingMembers` doc
2. Admin visits `/admin` → sees user in "Club Member Requests"
3. Admin clicks "Approve" → API:
   - Creates doc in `members` collection
   - Logs decision in `adminDecisions`
   - Deletes from `pendingMembers`

### Example 2: Member Joins Project
1. Priya sees "AI Study Buddy" project
2. Clicks "Request to Join" → creates `projectInterests` doc
3. **Option A - Admin Path:**
   - Geetansh (admin) visits `/admin` → "Project Join Requests" tab
   - Sees Priya's request for AI Study Buddy
   - Clicks "Approve"
4. **Option B - Owner Path:**
   - Geetansh (AI Study Buddy owner) visits `/dashboard/projects/ai-tutor/manage`
   - Sees Priya's request (filtered to only AI Tutor)
   - Clicks "Approve"
5. Both paths trigger same API → API:
   - Creates doc in `projectMembers` with Priya + AI Tutor IDs
   - Logs decision in `adminDecisions`
   - Deletes from `projectInterests`

## 🚀 Next Steps

1. Fix Firebase authentication (new service account key)
2. Run seed script to test connection
3. Verify collections appear in Firebase Console
4. Test approval workflows on localhost
5. Deploy to production with environment variables
