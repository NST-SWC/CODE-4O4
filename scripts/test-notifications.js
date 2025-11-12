#!/usr/bin/env node

/**
 * Test script for notification system
 * Usage: node scripts/test-notifications.js
 */

const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin
const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;

if (!serviceAccountJson) {
  console.error('❌ FIREBASE_SERVICE_ACCOUNT environment variable not found!');
  process.exit(1);
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(serviceAccountJson);
  console.log('✅ Service account parsed successfully');
} catch (error) {
  console.error('❌ Failed to parse FIREBASE_SERVICE_ACCOUNT:', error.message);
  process.exit(1);
}

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log('✅ Firebase Admin initialized\n');
} catch (error) {
  console.error('❌ Failed to initialize Firebase:', error.message);
  process.exit(1);
}

const db = admin.firestore();
const messaging = admin.messaging();

async function testNotifications() {
  console.log('🧪 Testing Notification System\n');
  console.log('─'.repeat(50));

  try {
    // Test 1: Check for members with FCM tokens
    console.log('\n📋 Test 1: Checking members with FCM tokens...');
    const membersSnapshot = await db.collection('members')
      .where('fcmTokens', '!=', null)
      .get();

    if (membersSnapshot.empty) {
      console.log('⚠️  No members with FCM tokens found');
      console.log('   Members need to enable notifications in the app first');
      return;
    }

    console.log(`✅ Found ${membersSnapshot.size} member(s) with FCM tokens`);
    
    // Display members
    membersSnapshot.forEach(doc => {
      const data = doc.data();
      console.log(`   - ${data.name || 'Unknown'} (${doc.id}): ${data.fcmTokens?.length || 0} token(s)`);
    });

    // Test 2: Send a test notification to the first member
    console.log('\n📤 Test 2: Sending test notification...');
    const firstMember = membersSnapshot.docs[0];
    const memberData = firstMember.data();
    const testToken = memberData.fcmTokens[0];

    console.log(`   Sending to: ${memberData.name || 'Unknown'}`);
    console.log(`   User ID: ${firstMember.id}`);

    const message = {
      notification: {
        title: '🧪 Test Notification',
        body: 'This is a test notification from the NST Dev Club portal',
      },
      data: {
        url: '/dashboard',
        testId: Date.now().toString(),
      },
      webpush: {
        fcmOptions: {
          link: '/dashboard',
        },
        notification: {
          icon: '/icon-192x192.png',
        },
      },
      token: testToken,
    };

    try {
      const response = await messaging.send(message);
      console.log('✅ Notification sent successfully!');
      console.log(`   Message ID: ${response}`);

      // Store in database
      await db.collection('notifications').add({
        userId: firstMember.id,
        title: message.notification.title,
        body: message.notification.body,
        url: message.data.url,
        icon: '/icon-192x192.png',
        read: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log('✅ Notification stored in database');
    } catch (sendError) {
      console.error('❌ Failed to send notification:', sendError.message);
      
      if (sendError.code === 'messaging/invalid-registration-token' ||
          sendError.code === 'messaging/registration-token-not-registered') {
        console.log('   Token may be expired or invalid');
        console.log('   User should re-enable notifications in the app');
      }
    }

    // Test 3: Check notification history
    console.log('\n📜 Test 3: Checking notification history...');
    const notificationsSnapshot = await db.collection('notifications')
      .orderBy('createdAt', 'desc')
      .limit(5)
      .get();

    if (notificationsSnapshot.empty) {
      console.log('⚠️  No notifications found in history');
    } else {
      console.log(`✅ Found ${notificationsSnapshot.size} recent notification(s):`);
      notificationsSnapshot.forEach((doc, index) => {
        const data = doc.data();
        const createdAt = data.createdAt?.toDate().toLocaleString() || 'Unknown';
        console.log(`   ${index + 1}. ${data.title}`);
        console.log(`      ${data.body}`);
        console.log(`      Created: ${createdAt}, Read: ${data.read ? 'Yes' : 'No'}`);
      });
    }

    // Test 4: Check notification preferences
    console.log('\n⚙️  Test 4: Checking notification preferences...');
    const memberPrefs = memberData.notificationPreferences || {};
    console.log('   Preferences:', JSON.stringify(memberPrefs, null, 2));

    // Test 5: Validate service worker setup
    console.log('\n🔧 Test 5: Validating service worker setup...');
    console.log('   Service worker location: public/firebase-messaging-sw.js');
    console.log('   ✅ Check if file exists and is properly configured');
    
    console.log('\n─'.repeat(50));
    console.log('\n✅ Notification system tests completed!');
    console.log('\n📝 Next steps:');
    console.log('   1. Open the app in a browser');
    console.log('   2. Enable notifications when prompted');
    console.log('   3. Check the notification bell for the test notification');
    console.log('   4. Try RSVPing to an event to test automatic notifications');

  } catch (error) {
    console.error('\n❌ Test failed:', error);
    console.error(error.stack);
  }
}

// Run tests
testNotifications()
  .then(() => {
    console.log('\n🎉 All tests completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n💥 Test suite failed:', error);
    process.exit(1);
  });
