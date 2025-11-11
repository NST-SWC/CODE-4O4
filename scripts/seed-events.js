/**
 * Script to add sample events to Firebase for testing
 * Run with: node scripts/seed-events.js
 */

const admin = require('firebase-admin');
require('dotenv').config({ path: '.env.local' });

// Initialize Firebase Admin using environment variables
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

// Sample events
const sampleEvents = [
  {
    title: "React Workshop: Building Modern UIs",
    date: "2024-12-20",
    time: "6:00 PM",
    type: "Workshop",
    summary: "Learn to build modern, responsive UIs with React 18 and Tailwind CSS",
    location: "NST Lab 101",
    attendees: 15,
    capacity: 30,
    status: "open"
  },
  {
    title: "Firebase Masterclass",
    date: "2024-12-22",
    time: "5:30 PM",
    type: "Workshop",
    summary: "Deep dive into Firebase Authentication, Firestore, and Cloud Functions",
    location: "NST Lab 102",
    attendees: 8,
    capacity: 25,
    status: "open"
  },
  {
    title: "Hack Night: Build Your Portfolio",
    date: "2024-12-25",
    time: "7:00 PM",
    type: "Hack Night",
    summary: "Collaborative session to build and deploy your portfolio website",
    location: "NST Lab 201",
    attendees: 20,
    capacity: 40,
    status: "open"
  },
  {
    title: "Tech Talk: AI in Production",
    date: "2025-01-05",
    time: "6:30 PM",
    type: "Talk",
    summary: "Industry experts share insights on deploying AI models at scale",
    location: "NST Auditorium",
    attendees: 35,
    capacity: 100,
    status: "open"
  }
];

async function seedEvents() {
  try {
    console.log('🔄 Starting to seed events...');
    
    for (const event of sampleEvents) {
      const docRef = await db.collection('events').add({
        ...event,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`✅ Added event: ${event.title} (ID: ${docRef.id})`);
    }
    
    console.log('✅ All events seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding events:', error);
    process.exit(1);
  }
}

seedEvents();
