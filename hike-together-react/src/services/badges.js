import {
  collection,
  doc,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db, analytics } from './firebase';
import { logEvent } from 'firebase/analytics';
import { BADGES } from '../utils/constants';

export const checkForNewBadges = async (familyId, totalHikes) => {
  try {
    // Get already earned badges
    const badgesRef = collection(db, 'families', familyId, 'badges');
    const querySnapshot = await getDocs(badgesRef);
    const earnedBadgeIds = querySnapshot.docs.map(doc => doc.data().badgeId);

    // Find newly earned badges
    const newBadges = BADGES.filter(
      badge => totalHikes >= badge.requirement && !earnedBadgeIds.includes(badge.id)
    );

    // Save new badges to Firestore
    for (const badge of newBadges) {
      await addDoc(collection(db, 'families', familyId, 'badges'), {
        badgeId: badge.id,
        name: badge.name,
        emoji: badge.emoji,
        description: badge.description,
        requirement: badge.requirement,
        earnedAt: serverTimestamp(),
      });

      logEvent(analytics, 'badge_earned', { badge_id: badge.id, badge_name: badge.name });
    }

    return { success: true, newBadges };
  } catch (error) {
    console.error('Check badges error:', error);
    return { success: false, error: error.message };
  }
};

export const getEarnedBadges = async (familyId) => {
  try {
    const badgesRef = collection(db, 'families', familyId, 'badges');
    const querySnapshot = await getDocs(badgesRef);

    const earnedBadges = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { success: true, earnedBadges };
  } catch (error) {
    console.error('Get earned badges error:', error);
    return { success: false, error: error.message };
  }
};

export const getAllBadgesWithStatus = async (familyId) => {
  try {
    // Get earned badges
    const result = await getEarnedBadges(familyId);
    if (!result.success) {
      return result;
    }

    const earnedBadgeIds = result.earnedBadges.map(b => b.badgeId);

    // Map all badges with earned status
    const allBadges = BADGES.map(badge => ({
      ...badge,
      earned: earnedBadgeIds.includes(badge.id),
      earnedData: result.earnedBadges.find(b => b.badgeId === badge.id),
    }));

    return { success: true, badges: allBadges };
  } catch (error) {
    console.error('Get all badges error:', error);
    return { success: false, error: error.message };
  }
};
