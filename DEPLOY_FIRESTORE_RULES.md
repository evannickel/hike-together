# Deploy Firestore Security Rules

The app is getting "Missing or insufficient permissions" errors because the Firestore security rules need to be deployed.

## Quick Fix (Recommended)

### Option 1: Deploy via Firebase Console (Easiest)
1. Go to https://console.firebase.google.com/project/hike-together-app/firestore/rules
2. Copy and paste the contents of `firestore.rules` from this repository
3. Click "Publish" to deploy the rules

### Option 2: Deploy via Firebase CLI
If you have Firebase CLI installed:

```bash
cd /home/user/hike-together
firebase deploy --only firestore:rules
```

If you don't have Firebase CLI:
```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules
```

## What the Rules Do

The security rules in `firestore.rules` allow:

✅ **Users Collection**
- Users can read/write their own user document

✅ **Families Collection**
- Family members can read/write their family document
- Only members of a family can access that family's data

✅ **Hikes Subcollection**
- Family members can create, read, update, and delete hikes
- Users can only access hikes in their own family

✅ **Badges Subcollection**
- Family members can create, read, update, and delete badges
- Users can only access badges in their own family

## Security Features

- All rules require authentication (users must be logged in)
- Users can only access data for families they belong to
- Cross-family data access is prevented
- Anonymous access is blocked

## After Deploying

Once you deploy the rules:
1. Refresh the app at hiketogether.app
2. The "Missing or insufficient permissions" errors will be gone
3. Badge tracking will work correctly
4. New user signups will work properly

## Testing

After deployment, test by:
1. Creating a new account
2. Creating a family
3. Adding a hike with badges
4. Check that badges appear in the Badges page
5. Check that stats update correctly
