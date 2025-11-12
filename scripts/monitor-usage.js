#!/usr/bin/env node

/**
 * Firebase Usage Monitor
 * Tracks estimated Firebase reads/writes to stay within free tier limits
 * Usage: node scripts/monitor-usage.js
 */

const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin
const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;

if (!serviceAccountJson) {
  console.error('❌ FIREBASE_SERVICE_ACCOUNT environment variable not found!');
  process.exit(1);
}

try {
  const serviceAccount = JSON.parse(serviceAccountJson);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log('✅ Firebase Admin initialized\n');
} catch (error) {
  console.error('❌ Failed to initialize Firebase:', error.message);
  process.exit(1);
}

const db = admin.firestore();

async function monitorUsage() {
  console.log('📊 Firebase Usage Monitor');
  console.log('='.repeat(60));
  console.log('Free Tier Limits:');
  console.log('  - Reads: 50,000/day');
  console.log('  - Writes: 20,000/day');
  console.log('  - Deletes: 20,000/day');
  console.log('  - FCM Messages: Unlimited ✨');
  console.log('='.repeat(60));

  try {
    // Get collection sizes
    console.log('\n📁 Database Statistics:\n');

    const collections = {
      members: await db.collection('members').count().get(),
      notifications: await db.collection('notifications').count().get(),
      events: await db.collection('events').count().get(),
      projects: await db.collection('projects').count().get(),
      eventRsvps: await db.collection('eventRsvps').count().get(),
      projectInterests: await db.collection('projectInterests').count().get(),
      sessions: await db.collection('sessions').count().get(),
      pendingMembers: await db.collection('pendingMembers').count().get(),
    };

    let totalDocs = 0;
    for (const [name, snapshot] of Object.entries(collections)) {
      const count = snapshot.data().count;
      totalDocs += count;
      console.log(`  ${name.padEnd(20)} ${count.toString().padStart(6)} documents`);
    }

    console.log(`  ${'─'.repeat(20)} ${'─'.repeat(6)}`);
    console.log(`  ${'TOTAL'.padEnd(20)} ${totalDocs.toString().padStart(6)} documents`);

    // Estimate daily usage
    console.log('\n📈 Estimated Daily Usage (60 users):\n');

    const memberCount = collections.members.data().count;
    const notificationCount = collections.notifications.data().count;
    const eventCount = collections.events.data().count;
    const projectCount = collections.projects.data().count;

    // Conservative estimates per user per day
    const estimates = {
      'Notification checks': { perUser: 5, reads: memberCount * 5 },
      'Notification fetches': { perUser: 3, reads: memberCount * 3 },
      'Event page loads': { perUser: 2, reads: memberCount * 2 * eventCount },
      'Project page loads': { perUser: 2, reads: memberCount * 2 * projectCount },
      'Dashboard loads': { perUser: 3, reads: memberCount * 3 },
      'Profile views': { perUser: 1, reads: memberCount * 1 },
    };

    let totalReads = 0;
    for (const [action, data] of Object.entries(estimates)) {
      totalReads += data.reads;
      console.log(`  ${action.padEnd(25)} ~${data.reads.toString().padStart(5)} reads`);
    }

    console.log(`  ${'─'.repeat(25)} ${'─'.repeat(6)}`);
    console.log(`  ${'ESTIMATED DAILY TOTAL'.padEnd(25)} ~${totalReads.toString().padStart(5)} reads`);

    // Calculate percentage of limit
    const readLimit = 50000;
    const percentage = ((totalReads / readLimit) * 100).toFixed(1);
    const remaining = readLimit - totalReads;

    console.log('\n📊 Usage Analysis:\n');
    console.log(`  Daily Read Limit:        ${readLimit.toLocaleString()}`);
    console.log(`  Estimated Usage:         ${totalReads.toLocaleString()}`);
    console.log(`  Remaining:               ${remaining.toLocaleString()}`);
    console.log(`  Usage Percentage:        ${percentage}%`);

    // Status indicator
    let status = '✅ EXCELLENT';
    let statusColor = '\x1b[32m'; // Green
    if (percentage > 80) {
      status = '🚨 CRITICAL';
      statusColor = '\x1b[31m'; // Red
    } else if (percentage > 60) {
      status = '⚠️  WARNING';
      statusColor = '\x1b[33m'; // Yellow
    } else if (percentage > 40) {
      status = '👍 GOOD';
      statusColor = '\x1b[36m'; // Cyan
    }

    console.log(`  Status:                  ${statusColor}${status}\x1b[0m`);

    // Recommendations
    console.log('\n💡 Optimization Tips:\n');
    if (percentage < 30) {
      console.log('  ✅ You\'re doing great! Your usage is well optimized.');
      console.log('  ✅ Current optimizations are working effectively.');
    } else if (percentage < 60) {
      console.log('  👍 Usage is good, but consider these improvements:');
      console.log('     - Increase cache duration for static data');
      console.log('     - Implement lazy loading for less-used features');
      console.log('     - Use pagination more aggressively');
    } else if (percentage < 80) {
      console.log('  ⚠️  Approaching limits! Immediate actions:');
      console.log('     - Review and extend cache times (5→15 minutes)');
      console.log('     - Reduce query limits (20→10 results per page)');
      console.log('     - Implement request throttling');
      console.log('     - Consider reducing real-time updates');
    } else {
      console.log('  🚨 URGENT! You\'re at risk of exceeding limits:');
      console.log('     - Enable aggressive caching (1 hour+)');
      console.log('     - Disable auto-refresh features');
      console.log('     - Implement strict rate limiting');
      console.log('     - Consider upgrading to Blaze plan');
    }

    // Check for notifications with FCM tokens
    console.log('\n🔔 Notification System Status:\n');
    
    const membersWithTokens = await db.collection('members')
      .where('fcmTokens', '!=', null)
      .count()
      .get();

    const tokenCount = membersWithTokens.data().count;
    console.log(`  Members with FCM tokens:  ${tokenCount}`);
    console.log(`  Push notifications:       FREE (unlimited) ✨`);
    console.log(`  Recent notifications:     ${notificationCount}`);

    // Calculate potential savings from FCM
    const savedReads = tokenCount * 10; // ~10 polling reads saved per user per day
    console.log(`  Reads saved by FCM/day:   ~${savedReads.toLocaleString()}`);

    // Scaling estimates
    console.log('\n📈 Scaling Estimates:\n');
    
    const readsPerUser = totalReads / memberCount;
    const scalingPoints = [100, 200, 300, 400, 500];
    
    console.log('  Users    Daily Reads    % of Limit    Status');
    console.log('  ─────────────────────────────────────────────');
    
    scalingPoints.forEach(users => {
      const estimate = Math.round(readsPerUser * users);
      const pct = ((estimate / readLimit) * 100).toFixed(1);
      let icon = '✅';
      if (pct > 80) icon = '🚨';
      else if (pct > 60) icon = '⚠️';
      else if (pct > 40) icon = '👍';
      
      console.log(`  ${users.toString().padStart(5)}    ${estimate.toString().padStart(11)}    ${pct.toString().padStart(7)}%     ${icon}`);
    });

    console.log('\n💰 Cost Analysis (if upgraded to Blaze):\n');
    
    const overageReads = Math.max(0, totalReads - readLimit);
    const costPer100k = 0.06;
    const monthlyCost = (totalReads / 100000 * costPer100k * 30).toFixed(2);
    
    console.log(`  Current overage:         ${overageReads.toLocaleString()} reads`);
    console.log(`  Cost per 100K reads:     $${costPer100k}`);
    console.log(`  Estimated monthly cost:  $${monthlyCost}`);
    console.log('  (Assuming current usage rate)');

    console.log('\n' + '='.repeat(60));
    console.log('✅ Monitoring complete!\n');

  } catch (error) {
    console.error('\n❌ Error during monitoring:', error);
    console.error(error.stack);
  }
}

// Run monitoring
monitorUsage()
  .then(() => {
    console.log('💡 Tip: Run this script daily to track usage trends');
    console.log('🔗 View real usage: https://console.firebase.google.com/project/nst-swc1/usage\n');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Monitoring failed:', error);
    process.exit(1);
  });
