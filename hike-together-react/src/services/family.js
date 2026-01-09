import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  arrayUnion,
} from 'firebase/firestore';
import { db, analytics } from './firebase';
import { logEvent } from 'firebase/analytics';

// Generate a random 6-character invite code
const generateInviteCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const createFamily = async (userId, familyName) => {
  try {
    const inviteCode = generateInviteCode();
    const familyId = doc(collection(db, 'families')).id;

    // Create family document
    await setDoc(doc(db, 'families', familyId), {
      name: familyName,
      inviteCode,
      ownerUserId: userId,
      memberUserIds: [userId],
      subscriptionStatus: 'free',
      hikesThisMonth: 0,
      unitSystem: 'imperial', // Default to imperial (miles, feet)
      createdAt: serverTimestamp(),
    });

    // Link user to family
    await setDoc(doc(db, 'users', userId), {
      familyId,
      role: 'owner',
      createdAt: serverTimestamp(),
    }, { merge: true });

    logEvent(analytics, 'family_created');

    return { success: true, familyId, inviteCode };
  } catch (error) {
    console.error('Create family error:', error);
    return { success: false, error: error.message };
  }
};

export const joinFamily = async (userId, inviteCode) => {
  try {
    if (!inviteCode || inviteCode.trim().length === 0) {
      return { success: false, error: 'Please enter an invite code' };
    }

    // Normalize invite code
    const normalizedCode = inviteCode.trim().toUpperCase();

    // Find family by invite code
    const familiesRef = collection(db, 'families');
    const q = query(familiesRef, where('inviteCode', '==', normalizedCode));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { success: false, error: 'Invalid invite code. Please check the code and try again.' };
    }

    const familyDoc = querySnapshot.docs[0];
    const familyId = familyDoc.id;
    const familyData = familyDoc.data();

    // Check if user is already a member
    if (familyData.memberUserIds && familyData.memberUserIds.includes(userId)) {
      return { success: false, error: 'You are already a member of this family' };
    }

    // Add user to family's member list using arrayUnion (prevents race conditions)
    await updateDoc(doc(db, 'families', familyId), {
      memberUserIds: arrayUnion(userId),
    });

    // Link user to family
    await setDoc(doc(db, 'users', userId), {
      familyId,
      role: 'member',
      createdAt: serverTimestamp(),
    }, { merge: true });

    logEvent(analytics, 'family_joined');

    return { success: true, familyId };
  } catch (error) {
    console.error('Join family error:', error);

    // Provide more helpful error messages
    if (error.code === 'permission-denied') {
      return { success: false, error: 'Permission denied. Please check your Firestore security rules.' };
    }

    return { success: false, error: error.message || 'Failed to join family. Please try again.' };
  }
};

export const getFamily = async (familyId) => {
  try {
    const familyDoc = await getDoc(doc(db, 'families', familyId));

    if (!familyDoc.exists()) {
      return { success: false, error: 'Family not found' };
    }

    return { success: true, family: { id: familyDoc.id, ...familyDoc.data() } };
  } catch (error) {
    console.error('Get family error:', error);
    return { success: false, error: error.message };
  }
};

export const getUserFamily = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));

    if (!userDoc.exists() || !userDoc.data().familyId) {
      return { success: false, error: 'No family found' };
    }

    const familyId = userDoc.data().familyId;
    return await getFamily(familyId);
  } catch (error) {
    console.error('Get user family error:', error);
    return { success: false, error: error.message };
  }
};

export const updateFamilyPreferences = async (familyId, preferences) => {
  try {
    await updateDoc(doc(db, 'families', familyId), preferences);
    logEvent(analytics, 'family_preferences_updated');
    return { success: true };
  } catch (error) {
    console.error('Update family preferences error:', error);
    return { success: false, error: error.message };
  }
};

// Ensure family has an invite code (for existing families that might not have one)
export const ensureInviteCode = async (familyId) => {
  try {
    if (!familyId) {
      return { success: false, error: 'Family ID is required' };
    }

    const familyDoc = await getDoc(doc(db, 'families', familyId));

    if (!familyDoc.exists()) {
      return { success: false, error: 'Family not found' };
    }

    const familyData = familyDoc.data();

    // If family already has an invite code, return it
    if (familyData.inviteCode) {
      return { success: true, inviteCode: familyData.inviteCode };
    }

    // Generate new invite code
    const inviteCode = generateInviteCode();
    await updateDoc(doc(db, 'families', familyId), { inviteCode });

    logEvent(analytics, 'invite_code_generated');

    return { success: true, inviteCode };
  } catch (error) {
    console.error('Ensure invite code error:', error);

    // Provide more helpful error messages
    if (error.code === 'permission-denied') {
      return { success: false, error: 'Permission denied. Please check your Firestore security rules.' };
    }

    return { success: false, error: error.message || 'Failed to generate invite code' };
  }
};
