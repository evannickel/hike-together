# 🥾 Hike Together - Modern React Web App

A family hiking tracker web app built with React, Firebase, and modern web technologies.

## ✨ Features

- ✅ Email/password authentication
- ✅ Family creation and joining (via invite codes)
- ✅ Multiple family members can join same family
- ✅ Hike tracking (name, date, location, distance, elevation, difficulty, notes)
- ✅ Photo upload for hikes (Firebase Storage)
- ✅ Badge system with 5 core milestones
- ✅ Badge celebration animations with confetti 🎉
- ✅ Freemium model (3 hikes/month free, unlimited for premium)
- ✅ Offline support (Firebase built-in)

### Badge System
1. 🥾 **First Steps** - Complete your first hike
2. 🌱 **Getting Started** - Complete 5 hikes
3. 🗺️ **Trail Explorer** - Complete 10 hikes
4. ⛰️ **Mountain Climber** - Complete 25 hikes
5. 🏆 **Hiking Hero** - Complete 50 hikes

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be running at http://localhost:5173/

### Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## 🌐 Deployment

### Firebase Hosting (Recommended)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and initialize
firebase login
firebase init hosting

# Build and deploy
npm run build
firebase deploy --only hosting
```

### Vercel (Easiest)

```bash
npm install -g vercel
vercel
```

### Netlify

Drag and drop the `dist` folder after running `npm run build`

## 📁 Project Structure

```
src/
├── services/       # Firebase services (auth, family, hikes, badges)
├── components/     # Reusable UI components
├── pages/          # Main pages
├── hooks/          # Custom React hooks
├── utils/          # Constants and helpers
└── App.jsx         # Main app component
```

## 💰 TODO: Stripe Integration

The paywall UI is ready but needs Stripe integration:

1. Create Stripe account
2. Get publishable key
3. Install: `npm install @stripe/stripe-js`
4. Update PaywallModal.jsx with Stripe Checkout
5. Set up webhook to update subscriptionStatus

## 🔄 TODO: Monthly Reset

Set up Firebase Cloud Function to reset `hikesThisMonth` counter monthly.

## 📱 Convert to Mobile Later

When ready for iOS/Android:
```bash
npm install @capacitor/core @capacitor/cli
npx cap init
npx cap add ios android
```

Most code will work as-is!
