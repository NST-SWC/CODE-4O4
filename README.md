# NSTSWC Dev Club Portal

A secure, neon-inspired developer club portal built with Next.js 16, Tailwind CSS v4, Framer Motion, and Firebase.

## ⚠️ IMPORTANT: Security Setup Required

**Before deploying to production, you MUST complete these security steps:**

### 1. Generate and Add JWT_SECRET

```bash
# Generate a secure secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Add to Vercel Environment Variables:
# Name: JWT_SECRET
# Value: [paste generated secret]
# Environment: Production, Preview, Development
```

### 2. Set ADMIN_PASSWORD

```bash
# Add to Vercel Environment Variables:
# Name: ADMIN_PASSWORD
# Value: [your secure admin password]
```

### 3. Password Migration for Existing Users

**CRITICAL**: Existing users with plaintext passwords cannot log in until migrated.

**Option A - Force Password Reset** (Recommended):
- Send email to all users requesting password reset
- New passwords will be automatically hashed

**Option B - One-Time Migration**:
- Run migration script to hash existing passwords
- See deployment documentation for details

## 🔐 Security Features

- ✅ **bcrypt Password Hashing** - All passwords hashed with 12 salt rounds
- ✅ **JWT Authentication** - Secure token-based auth with expiration
- ✅ **Rate Limiting** - Protection against brute force attacks (5 attempts/15min)
- ✅ **Security Headers** - HSTS, CSP, X-Frame-Options, and more
- ✅ **Input Validation** - XSS prevention and sanitization
- ✅ **No Credential Logging** - Passwords never appear in logs

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and add all required variables

# Run development server
npm run dev
# Visit http://localhost:3000
```

## 📋 Required Environment Variables

### Security (REQUIRED)
```bash
JWT_SECRET=<generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))">
ADMIN_PASSWORD=<your-secure-admin-password>
```

### Firebase (REQUIRED)
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=<your-api-key>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<your-project>.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<your-project-id>
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<your-project>.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<your-sender-id>
NEXT_PUBLIC_FIREBASE_APP_ID=<your-app-id>
FIREBASE_SERVICE_ACCOUNT=<your-service-account-json>
```

### Email (REQUIRED for notifications)
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<your-email@gmail.com>
SMTP_PASS=<your-app-password>
SMTP_FROM=<your-email@gmail.com>
```

### Optional
```bash
SLACK_WEBHOOK_URL=<your-slack-webhook>
WEBPUSH_SEND_SECRET=<your-webpush-secret>
```

## 🧰 Tech Stack

- **Framework**: Next.js 16 with App Router & TypeScript
- **Styling**: Tailwind CSS v4
- **Animation**: Framer Motion
- **Database**: Firebase Firestore
- **Authentication**: JWT + bcrypt
- **Email**: Nodemailer
- **Security**: Rate limiting, security headers, input validation

## 📁 Project Structure

```
src/
  app/
    api/              # Secure API routes
    dashboard/        # Authenticated portal
    hackathon/        # Hackathon registration
    projects/         # Projects listing
    events/           # Events feed
  components/         # Reusable UI components
  lib/
    auth-utils.ts     # Password hashing & JWT
    rate-limit.ts     # Rate limiting middleware
    firebase/         # Firebase helpers
```

## 🔒 Security Best Practices

1. **Never commit `.env` files** - Already in `.gitignore`
2. **Rotate secrets regularly** - Every 90 days recommended
3. **Use strong passwords** - Minimum 12 characters
4. **Monitor logs** - Check for suspicious activity
5. **Keep dependencies updated** - Run `npm audit` regularly

## 🚢 Deployment Checklist

- [ ] Add `JWT_SECRET` to Vercel environment variables
- [ ] Add `ADMIN_PASSWORD` to Vercel environment variables
- [ ] Add all Firebase credentials to Vercel
- [ ] Add SMTP credentials for email
- [ ] Plan password migration strategy
- [ ] Test authentication after deployment
- [ ] Verify security headers are active
- [ ] Monitor logs for errors

## 🔧 Development

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run security audit
npm audit

# Fix vulnerabilities
npm audit fix
```

## 📚 Additional Documentation

- Security implementation details in commit history
- Firebase setup in Firebase Console
- Vercel deployment in Vercel Dashboard

## ⚡ Features

- **Secure Authentication** - JWT tokens with bcrypt password hashing
- **Rate Limiting** - Protection against brute force attacks
- **Push Notifications** - Real-time updates via Firebase Cloud Messaging
- **Admin Dashboard** - Manage members, projects, and events
- **Hackathon Portal** - Dedicated registration and management
- **Leaderboard** - Track member points and achievements
- **Project Management** - Create and join collaborative projects
- **Event Calendar** - Schedule and RSVP to events

## 🆘 Troubleshooting

### "JWT_SECRET not set" error
- Ensure `JWT_SECRET` is added to Vercel environment variables
- Redeploy after adding the variable

### Login fails after deployment
- Check that password migration is complete
- Verify `ADMIN_PASSWORD` is set correctly
- Check Vercel function logs for errors

### Build errors
- Clear `.next` directory: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Run `npm audit fix` to fix vulnerabilities

## 📄 License

MIT

## 🤝 Contributing

Contributions welcome! Please ensure all security best practices are followed.

