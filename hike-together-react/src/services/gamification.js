import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db, analytics } from './firebase';
import { logEvent } from 'firebase/analytics';
import {
  XP_PER_HIKE,
  XP_PER_MILE,
  XP_PER_100_FEET_ELEVATION,
  XP_PER_BADGE,
  getLevelFromXP,
} from '../utils/constants';

// Calculate XP earned from a hike
export const calculateHikeXP = (hike) => {
  let totalXP = XP_PER_HIKE; // Base XP for completing a hike

  // Add XP for distance
  if (hike.distance) {
    totalXP += Math.floor(parseFloat(hike.distance) * XP_PER_MILE);
  }

  // Add XP for elevation
  if (hike.elevation) {
    totalXP += Math.floor((parseFloat(hike.elevation) / 100) * XP_PER_100_FEET_ELEVATION);
  }

  return totalXP;
};

// Add XP to family's total
export const addXPToFamily = async (familyId, xpAmount, source = 'hike') => {
  try {
    const familyRef = doc(db, 'families', familyId);
    const familyDoc = await getDoc(familyRef);

    if (!familyDoc.exists()) {
      return { success: false, error: 'Family not found' };
    }

    const currentXP = familyDoc.data().totalXP || 0;
    const newXP = currentXP + xpAmount;

    const currentLevel = getLevelFromXP(currentXP);
    const newLevel = getLevelFromXP(newXP);
    const leveledUp = newLevel.level > currentLevel.level;

    // Update family XP
    await updateDoc(familyRef, {
      totalXP: newXP,
      currentLevel: newLevel.level,
      lastXPUpdate: serverTimestamp(),
    });

    // Log analytics
    logEvent(analytics, 'xp_earned', {
      amount: xpAmount,
      source,
      new_total: newXP,
    });

    if (leveledUp) {
      logEvent(analytics, 'level_up', {
        new_level: newLevel.level,
        level_name: newLevel.name,
      });
    }

    return {
      success: true,
      xpEarned: xpAmount,
      totalXP: newXP,
      currentLevel,
      newLevel,
      leveledUp,
    };
  } catch (error) {
    console.error('Add XP error:', error);
    return { success: false, error: error.message };
  }
};

// Get family's current XP and level
export const getFamilyProgress = async (familyId) => {
  try {
    const familyRef = doc(db, 'families', familyId);
    const familyDoc = await getDoc(familyRef);

    if (!familyDoc.exists()) {
      return { success: false, error: 'Family not found' };
    }

    const totalXP = familyDoc.data().totalXP || 0;
    const currentLevel = getLevelFromXP(totalXP);

    return {
      success: true,
      totalXP,
      currentLevel,
    };
  } catch (error) {
    console.error('Get family progress error:', error);
    return { success: false, error: error.message };
  }
};

// Initialize family gamification data
export const initializeFamilyGamification = async (familyId) => {
  try {
    const familyRef = doc(db, 'families', familyId);
    await updateDoc(familyRef, {
      totalXP: 0,
      currentLevel: 1,
      createdAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error('Initialize gamification error:', error);
    return { success: false, error: error.message };
  }
};
