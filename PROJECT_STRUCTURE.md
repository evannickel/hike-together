# Hike Together Mobile - Project Structure

## 📁 Where Everything Goes

```
hike-together-mobile/
├── src/
│   ├── pages/              # Full screen components
│   │   ├── Auth.tsx        # Sign in/Sign up screen
│   │   ├── FamilySetup.tsx # Create/Join family
│   │   ├── HikeList.tsx    # List of hikes (home screen)
│   │   ├── HikeForm.tsx    # Add/Edit hike
│   │   ├── HikeDetail.tsx  # View single hike
│   │   ├── Badges.tsx      # Badge grid view
│   │   └── Settings.tsx    # Settings, logout, subscription
│   │
│   ├── components/         # Reusable UI components
│   │   ├── HikeCard.tsx    # Individual hike card
│   │   ├── BadgeCard.tsx   # Badge card (locked/unlocked)
│   │   ├── BadgeCelebration.tsx  # Confetti modal
│   │   ├── PaywallModal.tsx      # Subscription paywall
│   │   └── LoadingSpinner.tsx    # Loading state
│   │
│   ├── services/           # Business logic & Firebase
│   │   ├── firebase.ts     # Firebase initialization
│   │   ├── auth.ts         # Sign up, sign in, sign out
│   │   ├── family.ts       # Create family, join family
│   │   ├── hikes.ts        # CRUD for hikes
│   │   ├── badges.ts       # Badge calculations
│   │   ├── subscriptions.ts # RevenueCat integration
│   │   └── storage.ts      # Photo upload
│   │
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.ts      # Auth state management
│   │   ├── useFamily.ts    # Family data management
│   │   └── useHikes.ts     # Hikes data management
│   │
│   ├── types/              # TypeScript types
│   │   ├── Family.ts       # Family, User types
│   │   ├── Hike.ts         # Hike type
│   │   └── Badge.ts        # Badge type
│   │
│   ├── utils/              # Helper functions
│   │   ├── constants.ts    # Colors, badges, configs
│   │   └── helpers.ts      # Utility functions
│   │
│   ├── App.tsx             # Main app component
│   └── index.tsx           # App entry point
│
├── ios/                    # iOS native project (auto-generated)
├── android/                # Android native project (auto-generated)
├── public/                 # Static assets
├── capacitor.config.ts     # Capacitor configuration
└── package.json            # Dependencies
```

## 🗂 Data Models (TypeScript Types)

### User
```typescript
interface User {
  id: string;           // Firebase auth UID
  email: string;
  familyId?: string;    // Which family they belong to
  role?: 'owner' | 'member';  // Who created the family
  createdAt: Date;
}
```

### Family
```typescript
interface Family {
  id: string;
  name: string;         // "The Smith Family"
  inviteCode: string;   // "ABC123" - for joining
  ownerUserId: string;  // Who created it
  memberUserIds: string[];  // All users in this family
  createdAt: Date;
  subscriptionStatus?: 'free' | 'premium';  // For freemium
}
```

### Hike
```typescript
interface Hike {
  id: string;
  familyId: string;     // Which family this belongs to
  addedByUserId: string; // Who added it (optional metadata)
  name: string;
  date: string;         // ISO date string
  location: string;
  latitude?: number;    // For map
  longitude?: number;
  distance?: number;    // Miles
  elevation?: number;   // Feet
  difficulty: 'easy' | 'moderate' | 'hard';
  notes?: string;
  photoUrl?: string;    // Firebase Storage URL
  createdAt: Date;
}
```

### Badge
```typescript
interface Badge {
  id: string;
  name: string;         // "First Steps"
  emoji: string;        // "🥾"
  description: string;  // "Complete your first hike!"
  requirement: number;  // How many hikes needed
}

interface EarnedBadge {
  badgeId: string;
  familyId: string;
  earnedAt: Date;
}
```

## 🔥 Firestore Database Structure

```
users/
  {userId}/
    email: "mom@example.com"
    familyId: "family123"
    role: "owner"
    createdAt: timestamp

families/
  {familyId}/
    name: "The Smith Family"
    inviteCode: "ABC123"
    ownerUserId: "userId1"
    memberUserIds: ["userId1", "userId2"]
    subscriptionStatus: "free"
    hikesThisMonth: 2
    createdAt: timestamp

    hikes/
      {hikeId}/
        name: "Mount Rainier Trail"
        date: "2025-01-15"
        location: "Mount Rainier National Park"
        latitude: 46.8523
        longitude: -121.7603
        distance: 5.2
        elevation: 1200
        difficulty: "moderate"
        notes: "Beautiful views!"
        photoUrl: "https://..."
        addedByUserId: "userId1"
        createdAt: timestamp

    badges/
      {badgeId}/
        badgeId: "first_steps"
        name: "First Steps"
        emoji: "🥾"
        earnedAt: timestamp
```

## 🎨 Ionic Components We'll Use

Instead of building everything from scratch, we'll use Ionic's pre-built components:

```typescript
// Navigation
import { IonTabs, IonTabBar, IonTabButton, IonRouterOutlet } from '@ionic/react';

// Layout
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/react';

// Lists & Cards
import { IonList, IonItem, IonCard, IonCardHeader, IonCardContent } from '@ionic/react';

// Forms
import { IonInput, IonTextarea, IonSelect, IonSelectOption } from '@ionic/react';

// Buttons & Icons
import { IonButton, IonIcon } from '@ionic/react';

// Feedback
import { IonToast, IonAlert, IonLoading, IonModal } from '@ionic/react';

// Navigation
import { IonBackButton, IonButtons } from '@ionic/react';
```

## 🛣 App Navigation Structure

```
App
├── Auth Page (if not logged in)
│   ├── Sign In Tab
│   └── Sign Up Tab
│
├── Family Setup (if logged in but no family)
│   ├── Create Family
│   └── Join Family
│
└── Main App (if logged in + has family)
    ├── Tab 1: Hikes (Home)
    │   ├── Hike List
    │   ├── Add Hike (modal/page)
    │   └── Hike Detail (modal/page)
    │
    ├── Tab 2: Badges
    │   ├── Badge Grid
    │   └── Badge Detail (modal)
    │
    └── Tab 3: Settings
        ├── Family Info
        ├── Subscription Status
        ├── Invite Code
        └── Sign Out
```

## 📦 npm Scripts

```bash
# Development
npm start                    # Run in browser (for quick testing)
ionic serve                  # Same as above

# Build
npm run build               # Build web assets

# Mobile
npx cap sync                # Sync web code to native projects
npx cap open ios            # Open in Xcode
npx cap open android        # Open in Android Studio

# Testing on device
ionic cap run ios -l        # Run on iOS with live reload
ionic cap run android -l    # Run on Android with live reload
```

## 🔧 Configuration Files

### capacitor.config.ts
```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hiketogether.app',
  appName: 'Hike Together',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }
  }
};

export default config;
```

### package.json (key dependencies)
```json
{
  "name": "hike-together-mobile",
  "version": "1.0.0",
  "dependencies": {
    "@ionic/react": "^7.6.0",
    "@ionic/react-router": "^7.6.0",
    "@capacitor/core": "^5.6.0",
    "@capacitor/camera": "^5.0.0",
    "@capacitor/preferences": "^5.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.21.0",
    "firebase": "^10.7.1",
    "canvas-confetti": "^1.9.0"
  }
}
```

## 🎯 Development Workflow

1. **Make changes** in `src/` directory
2. **Test in browser**: `ionic serve` (fastest)
3. **Test on device**:
   ```bash
   npm run build
   npx cap sync
   npx cap open ios  # or android
   ```
4. **Commit changes**: `git add . && git commit -m "..."`

## 🚀 Release Workflow

1. **Update version** in `package.json`, `ios/App/App/Info.plist`, `android/app/build.gradle`
2. **Build production**:
   ```bash
   npm run build
   npx cap sync
   ```
3. **iOS**:
   - Open Xcode
   - Product → Archive
   - Upload to App Store Connect
4. **Android**:
   - Open Android Studio
   - Build → Generate Signed Bundle
   - Upload to Play Console

---

This structure keeps code organized and makes it easy to find things as the project grows!
