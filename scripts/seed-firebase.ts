/**
 * Firebase Seeding Script
 * Run this to populate Firebase with test data
 * Usage: npx ts-node scripts/seed-firebase.ts
 */

import * as admin from "firebase-admin";

// Initialize Firebase Admin from environment variable
const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;

if (!serviceAccountJson) {
  console.error("❌ FIREBASE_SERVICE_ACCOUNT environment variable not found!");
  console.error("Please set it in your .env.local file");
  process.exit(1);
}

try {
  const serviceAccount = JSON.parse(serviceAccountJson);
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  
  console.log("✅ Firebase Admin initialized from environment variable");
} catch (error) {
  console.error("❌ Failed to parse FIREBASE_SERVICE_ACCOUNT:", error);
  process.exit(1);
}

const db = admin.firestore();

async function seedData() {
  console.log("🌱 Starting Firebase seeding...\n");

  try {
    // 1. Add Members (approved club members)
    console.log("📝 Adding members...");
    const members = [
      {
        id: "geetansh-1",
        name: "Geetansh Goyal",
        email: "geetansh@example.com",
        phone: "+91 98765 43210",
        github: "geetanshgoyal",
        portfolio: "https://geetansh.dev",
        interests: ["Web Development", "AI", "Cloud Computing"],
        experience: "advanced",
        goals: "Lead projects and mentor juniors",
        role: "admin",
        availability: "Weekends",
        points: 150,
        badges: 5,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=geetansh@example.com",
        joinedAt: admin.firestore.FieldValue.serverTimestamp(),
        approvedBy: "system",
      },
      {
        id: "utsav-1",
        name: "Utsav Kumar",
        email: "utsav@example.com",
        phone: "+91 98765 43211",
        github: "utsavkumar",
        portfolio: "https://utsav.dev",
        interests: ["Mobile Development", "UI/UX", "Backend"],
        experience: "intermediate",
        goals: "Build production-ready apps",
        role: "student",
        availability: "Evenings",
        points: 80,
        badges: 3,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=utsav@example.com",
        joinedAt: admin.firestore.FieldValue.serverTimestamp(),
        approvedBy: "geetansh-1",
      },
      {
        id: "priya-1",
        name: "Priya Sharma",
        email: "priya@example.com",
        phone: "+91 98765 43212",
        github: "priyasharma",
        interests: ["Data Science", "Machine Learning", "Python"],
        experience: "intermediate",
        goals: "Work on ML projects",
        role: "student",
        availability: "Flexible",
        points: 60,
        badges: 2,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya@example.com",
        joinedAt: admin.firestore.FieldValue.serverTimestamp(),
        approvedBy: "geetansh-1",
      },
      {
        id: "rahul-1",
        name: "Rahul Singh",
        email: "rahul@example.com",
        phone: "+91 98765 43213",
        interests: ["Blockchain", "Web3", "Smart Contracts"],
        experience: "beginner",
        goals: "Learn blockchain development",
        role: "student",
        availability: "Weekends",
        points: 30,
        badges: 1,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rahul@example.com",
        joinedAt: admin.firestore.FieldValue.serverTimestamp(),
        approvedBy: "geetansh-1",
      },
    ];

    for (const member of members) {
      await db.collection("members").doc(member.id).set(member);
      console.log(`  ✅ Added member: ${member.name}`);
    }

    // 2. Add Pending Members (waiting for admin approval)
    console.log("\n📝 Adding pending members...");
    const pendingMembers = [
      {
        name: "Amit Patel",
        email: "amit@example.com",
        phone: "+91 98765 43214",
        github: "amitpatel",
        portfolio: "https://amit.dev",
        interests: ["DevOps", "Docker", "Kubernetes"],
        experience: "intermediate",
        goals: "Master cloud infrastructure",
        role: "student",
        availability: "Evenings",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        status: "pending",
      },
      {
        name: "Sneha Reddy",
        email: "sneha@example.com",
        phone: "+91 98765 43215",
        interests: ["Frontend", "React", "Design Systems"],
        experience: "beginner",
        goals: "Become a frontend expert",
        role: "student",
        availability: "Flexible",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        status: "pending",
      },
    ];

    for (const member of pendingMembers) {
      await db.collection("pendingMembers").add(member);
      console.log(`  ✅ Added pending member: ${member.name}`);
    }

    // 3. Add Projects
    console.log("\n📝 Adding projects...");
    const projects = [
      {
        id: "ai-tutor",
        title: "AI Study Buddy",
        description: "An intelligent tutoring system powered by machine learning",
        status: "active",
        members: 3,
        tech: ["Python", "TensorFlow", "FastAPI", "React"],
        owner: "Geetansh Goyal",
        ownerId: "geetansh-1",
        category: "AI/ML",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      {
        id: "campus-connect",
        title: "Campus Connect",
        description: "Social platform for campus events and networking",
        status: "recruiting",
        members: 2,
        tech: ["Next.js", "Firebase", "TypeScript", "Tailwind"],
        owner: "Utsav Kumar",
        ownerId: "utsav-1",
        category: "Web Development",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      {
        id: "blockchain-voting",
        title: "Blockchain Voting System",
        description: "Secure and transparent voting system using blockchain",
        status: "active",
        members: 2,
        tech: ["Solidity", "Ethereum", "Web3.js", "React"],
        owner: "Geetansh Goyal",
        ownerId: "geetansh-1",
        category: "Blockchain",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      },
    ];

    for (const project of projects) {
      await db.collection("projects").doc(project.id).set(project);
      console.log(`  ✅ Added project: ${project.title}`);
    }

    // 4. Add Project Interests (pending project join requests)
    console.log("\n📝 Adding project interests...");
    const projectInterests = [
      {
        projectId: "ai-tutor",
        userId: "priya-1",
        status: "pending",
        message: "I have experience with TensorFlow and would love to contribute!",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      {
        projectId: "campus-connect",
        userId: "rahul-1",
        status: "pending",
        message: "Interested in learning Next.js through this project",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      {
        projectId: "blockchain-voting",
        userId: "utsav-1",
        status: "pending",
        message: "Want to explore blockchain development",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      },
    ];

    for (const interest of projectInterests) {
      await db.collection("projectInterests").add(interest);
      console.log(`  ✅ Added project interest: ${interest.userId} → ${interest.projectId}`);
    }

    // 5. Add Project Members (approved members in projects)
    console.log("\n📝 Adding project members...");
    const projectMembers = [
      {
        projectId: "ai-tutor",
        userId: "geetansh-1",
        userName: "Geetansh Goyal",
        userEmail: "geetansh@example.com",
        role: "owner",
        joinedAt: admin.firestore.FieldValue.serverTimestamp(),
        addedBy: "geetansh-1",
      },
      {
        projectId: "ai-tutor",
        userId: "utsav-1",
        userName: "Utsav Kumar",
        userEmail: "utsav@example.com",
        role: "member",
        joinedAt: admin.firestore.FieldValue.serverTimestamp(),
        addedBy: "geetansh-1",
      },
      {
        projectId: "campus-connect",
        userId: "utsav-1",
        userName: "Utsav Kumar",
        userEmail: "utsav@example.com",
        role: "owner",
        joinedAt: admin.firestore.FieldValue.serverTimestamp(),
        addedBy: "utsav-1",
      },
      {
        projectId: "blockchain-voting",
        userId: "geetansh-1",
        userName: "Geetansh Goyal",
        userEmail: "geetansh@example.com",
        role: "owner",
        joinedAt: admin.firestore.FieldValue.serverTimestamp(),
        addedBy: "geetansh-1",
      },
    ];

    for (const member of projectMembers) {
      await db.collection("projectMembers").add(member);
      console.log(`  ✅ Added project member: ${member.userName} → ${member.projectId}`);
    }

    // 6. Add some Admin Decisions (history log)
    console.log("\n📝 Adding admin decisions...");
    const adminDecisions = [
      {
        type: "member_approval",
        memberId: "utsav-1",
        decision: "approved",
        adminId: "geetansh-1",
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        notes: "Good portfolio and experience",
      },
      {
        type: "project_interest",
        interestId: "test-interest-1",
        projectId: "ai-tutor",
        userId: "utsav-1",
        decision: "approved",
        decidedBy: "geetansh-1",
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      },
    ];

    for (const decision of adminDecisions) {
      await db.collection("adminDecisions").add(decision);
      console.log(`  ✅ Added admin decision: ${decision.type}`);
    }

    console.log("\n✅ Firebase seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`  - ${members.length} members added`);
    console.log(`  - ${pendingMembers.length} pending members added`);
    console.log(`  - ${projects.length} projects added`);
    console.log(`  - ${projectInterests.length} project interests added`);
    console.log(`  - ${projectMembers.length} project members added`);
    console.log(`  - ${adminDecisions.length} admin decisions added`);
    console.log("\n🔥 Firebase is connected and working! Check your console.\n");

  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }

  process.exit(0);
}

// Run the seeding
seedData();
