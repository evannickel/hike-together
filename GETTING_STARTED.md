# Getting Started - Day 1 Checklist

## 🎯 Today's Goal
By end of day, you'll have:
- ✅ Ionic project created
- ✅ Running on your phone in dev mode
- ✅ Developer accounts applied for
- ✅ First screen (sign in/sign up) started

---

## Step 1: Environment Check (5 minutes)

Run these commands and tell me the output:

```bash
# Check Node.js version (need 18+)
node --version

# Check if you have npm
npm --version

# Check if you have git
git --version
```

**Do you have a Mac?** (Required for iOS development)
- [ ] Yes - I have a Mac
- [ ] No - I'm on Windows/Linux (we can still do Android)

**Installed software:**
- [ ] Xcode (Mac only) - Download from Mac App Store if missing
- [ ] Android Studio - Download from https://developer.android.com/studio

---

## Step 2: Install Ionic CLI (2 minutes)

```bash
# Install Ionic CLI globally
npm install -g @ionic/cli

# Verify installation
ionic --version
```

---

## Step 3: Apply for Developer Accounts (15 minutes)

### 🍎 Apple Developer Account ($99/year)
**DO THIS FIRST - Can take 24-48 hours for approval**

1. Go to: https://developer.apple.com/programs/enroll/
2. Sign in with your Apple ID
3. Click "Enroll"
4. Choose "Individual" (unless you have a company)
5. Fill out form and pay $99
6. Wait for approval email

**Status:** [ ] Applied, waiting for approval

### 🤖 Google Play Developer Account ($25 one-time)
**Usually instant approval**

1. Go to: https://play.google.com/console/signup
2. Sign in with Google account
3. Pay $25
4. Accept agreements
5. Should be approved immediately

**Status:** [ ] Account created and approved

---

## Step 4: Create New Ionic Project (5 minutes)

Let's create the project in a new directory (separate from your current web app):

```bash
# Navigate to where you want the project
cd ~/Projects  # Or wherever you keep projects

# Create new Ionic React app
ionic start hike-together-mobile blank --type=react --capacitor

# This will ask you some questions:
# - Framework: React
# - Create free Ionic account? → No (skip for now)

# Navigate into project
cd hike-together-mobile

# Open in your code editor
code .  # If you use VS Code
```

**Project created?** [ ] Yes

---

## Step 5: Add Mobile Platforms (3 minutes)

```bash
# Add iOS platform (Mac only)
npx cap add ios

# Add Android platform
npx cap add android

# Install Capacitor core
npm install @capacitor/core @capacitor/cli
```

---

## Step 6: Install Firebase (3 minutes)

```bash
# Install Firebase SDK
npm install firebase

# Install Capacitor plugins we'll need
npm install @capacitor/camera @capacitor/preferences @capacitor/push-notifications @capacitor/haptics

# Sync with native projects
npx cap sync
```

---

## Step 7: Configure Firebase (5 minutes)

You already have Firebase configured! Let's copy it over:

Create `src/services/firebase.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDS6292P80pBlZ-rMVOAEwHfFEGo9RDDrk",
  authDomain: "hike-together-app.firebaseapp.com",
  projectId: "hike-together-app",
  storageBucket: "hike-together-app.firebasestorage.app",
  messagingSenderId: "773950556723",
  appId: "1:773950556723:web:36b9faae2ec3ceaeaa7146",
  measurementId: "G-WXFDKVVEER"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
```

---

## Step 8: Test on Your Phone (10 minutes)

### For iOS (Mac only):
```bash
# Build and open in Xcode
npx cap open ios

# In Xcode:
# 1. Connect your iPhone via USB
# 2. Select your iPhone as the target device
# 3. Click the Play button (▶️)
# 4. First time: Trust computer on iPhone
# 5. First time: Settings → General → VPN & Device Management → Trust Developer App
# 6. App should launch on your phone!
```

### For Android:
```bash
# Build and open in Android Studio
npx cap open android

# In Android Studio:
# 1. Connect your Android phone via USB
# 2. Enable Developer Mode on phone:
#    Settings → About Phone → Tap "Build Number" 7 times
# 3. Enable USB Debugging:
#    Settings → Developer Options → USB Debugging
# 4. Select your phone as the target device
# 5. Click the Play button (▶️)
# 6. App should launch on your phone!
```

**App running on your phone?** [ ] Yes - I see the Ionic starter app!

---

## Step 9: Set Up Git (5 minutes)

```bash
# Initialize git (if not already done)
git init

# Create .gitignore (Ionic already created one)

# Create new branch for mobile development
git checkout -b mobile-app

# First commit
git add .
git commit -m "Initial Ionic project setup"

# Optional: Push to GitHub
# git remote add origin https://github.com/yourusername/hike-together-mobile.git
# git push -u origin mobile-app
```

---

## Step 10: Create Auth Service (30 minutes)

Now let's build the first real feature! Create `src/services/auth.ts`:

```typescript
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  User
} from 'firebase/auth';
import { auth, analytics } from './firebase';
import { logEvent } from 'firebase/analytics';

export const signUp = async (email: string, password: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    logEvent(analytics, 'sign_up', { method: 'email' });
    return { success: true, user: result.user };
  } catch (error: any) {
    console.error('Sign up error:', error);
    return { success: false, error: error.message };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    logEvent(analytics, 'login', { method: 'email' });
    return { success: true, user: result.user };
  } catch (error: any) {
    console.error('Sign in error:', error);
    return { success: false, error: error.message };
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    logEvent(analytics, 'logout');
    return { success: true };
  } catch (error: any) {
    console.error('Sign out error:', error);
    return { success: false, error: error.message };
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error: any) {
    console.error('Password reset error:', error);
    return { success: false, error: error.message };
  }
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};
```

---

## 🎉 End of Day 1 Checklist

By end of today, you should have:

- [x] Node.js and npm installed
- [x] Ionic CLI installed
- [x] Applied for Apple Developer account (waiting for approval)
- [x] Created Google Play Developer account
- [x] Created Ionic React project
- [x] Added iOS and Android platforms
- [x] Installed Firebase
- [x] Tested app running on your phone
- [x] Set up Git
- [x] Created auth service

---

## 📅 Tomorrow (Day 2): Build Auth UI

We'll create:
- Sign in screen
- Sign up screen
- Password reset
- Auth state management

---

## ❓ Troubleshooting

### "command not found: ionic"
```bash
# Make sure npm global bin is in your PATH
npm config get prefix
# Should be /usr/local or ~/.npm-global

# Try reinstalling
npm install -g @ionic/cli
```

### "Cannot find module 'firebase'"
```bash
# Make sure you're in the project directory
cd hike-together-mobile

# Reinstall dependencies
npm install
```

### "Xcode requires additional components"
- Click "Install" when prompted
- Wait for download and installation
- Restart Xcode

### "No devices found" in Android Studio
- Make sure USB debugging is enabled
- Try different USB cable
- Check phone shows "USB Debugging connected"

---

## 🆘 Need Help?

If you get stuck, tell me:
1. What command you ran
2. What error you got
3. What step you're on

Let's go! 🚀
