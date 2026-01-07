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
import { BADGES, XP_PER_BADGE } from '../utils/constants';

// Get season from date
const getSeason = (date) => {
  const month = new Date(date).getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'fall';
  return 'winter';
};

// Check if date is a holiday
const getHoliday = (date) => {
  const d = new Date(date);
  const month = d.getMonth();
  const day = d.getDate();

  if (month === 0 && day === 1) return 'new_year';
  if (month === 6 && day === 4) return 'independence';
  if (month === 9 && day === 31) return 'halloween';
  if (month === 10 && (day >= 22 && day <= 28 && d.getDay() === 4)) return 'thanksgiving';
  if (month === 11 && day === 25) return 'christmas';
  if (month === 11 && day === 31) return 'new_years_eve';

  // Memorial Day (last Monday of May)
  if (month === 4 && d.getDay() === 1 && day >= 25) return 'memorial';

  // Labor Day (first Monday of September)
  if (month === 8 && d.getDay() === 1 && day <= 7) return 'labor';

  return null;
};

// Calculate current streak from hike dates
const calculateStreak = (hikes) => {
  if (hikes.length === 0) return 0;

  // Sort hikes by date descending
  const sortedHikes = [...hikes].sort((a, b) =>
    new Date(b.date) - new Date(a.date)
  );

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (const hike of sortedHikes) {
    const hikeDate = new Date(hike.date);
    hikeDate.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor((currentDate - hikeDate) / (1000 * 60 * 60 * 24));

    if (daysDiff <= streak + 1) {
      streak++;
      currentDate = hikeDate;
    } else {
      break;
    }
  }

  return streak;
};

// Check if a badge should be earned based on its type and family data
const checkBadgeEligibility = (badge, familyStats, hikes) => {
  switch (badge.type) {
    case 'count':
      return familyStats.totalHikes >= badge.requirement;

    case 'distance':
      return familyStats.totalDistance >= badge.requirement;

    case 'elevation':
      return familyStats.totalElevation >= badge.requirement;

    case 'seasonal':
      // Check if any hike was during this season
      return hikes.some(hike => getSeason(hike.date) === badge.season);

    case 'streak':
      const currentStreak = calculateStreak(hikes);
      return currentStreak >= badge.requirement;

    case 'holiday':
      // Check if any hike was on this holiday
      return hikes.some(hike => getHoliday(hike.date) === badge.holiday);

    // These badges require manual claiming
    case 'weather':
    case 'discovery':
    case 'location':
    case 'special':
    case 'social':
      return false; // Must be manually claimed

    default:
      return false;
  }
};

// Check for newly earned automatic badges
export const checkForNewBadges = async (familyId, hikes) => {
  try {
    // Calculate family stats
    const totalHikes = hikes.length;
    const totalDistance = hikes.reduce((sum, h) => sum + (parseFloat(h.distance) || 0), 0);
    const totalElevation = hikes.reduce((sum, h) => sum + (parseFloat(h.elevation) || 0), 0);

    const familyStats = {
      totalHikes,
      totalDistance,
      totalElevation,
    };

    // Get already earned badges
    const badgesRef = collection(db, 'families', familyId, 'badges');
    const querySnapshot = await getDocs(badgesRef);
    const earnedBadgeIds = querySnapshot.docs.map(doc => doc.data().badgeId);

    // Find newly earned automatic badges
    const newBadges = BADGES.filter(badge => {
      if (earnedBadgeIds.includes(badge.id)) return false;
      return checkBadgeEligibility(badge, familyStats, hikes);
    });

    // Save new badges to Firestore
    for (const badge of newBadges) {
      await addDoc(collection(db, 'families', familyId, 'badges'), {
        badgeId: badge.id,
        name: badge.name,
        icon: badge.icon,
        type: badge.type,
        description: badge.desc,
        requirement: badge.requirement,
        earnedAt: serverTimestamp(),
        manualClaim: false,
      });

      logEvent(analytics, 'badge_earned', {
        badge_id: badge.id,
        badge_name: badge.name,
        badge_type: badge.type,
      });
    }

    return { success: true, newBadges };
  } catch (error) {
    console.error('Check badges error:', error);
    return { success: false, error: error.message, newBadges: [] };
  }
};

// Manually claim a badge (for discovery, weather, location, special, social badges)
export const claimBadge = async (familyId, badgeId) => {
  try {
    const badge = BADGES.find(b => b.id === badgeId);
    if (!badge) {
      return { success: false, error: 'Badge not found' };
    }

    // Check if badge can be manually claimed
    const manualTypes = ['weather', 'discovery', 'location', 'special', 'social'];
    if (!manualTypes.includes(badge.type)) {
      return { success: false, error: 'This badge cannot be manually claimed' };
    }

    // Check if already earned
    const badgesRef = collection(db, 'families', familyId, 'badges');
    const querySnapshot = await getDocs(badgesRef);
    const earnedBadgeIds = querySnapshot.docs.map(doc => doc.data().badgeId);

    if (earnedBadgeIds.includes(badgeId)) {
      return { success: false, error: 'Badge already earned' };
    }

    // Save badge
    await addDoc(collection(db, 'families', familyId, 'badges'), {
      badgeId: badge.id,
      name: badge.name,
      icon: badge.icon,
      type: badge.type,
      description: badge.desc,
      earnedAt: serverTimestamp(),
      manualClaim: true,
    });

    logEvent(analytics, 'badge_claimed', {
      badge_id: badge.id,
      badge_name: badge.name,
      badge_type: badge.type,
    });

    return { success: true, badge };
  } catch (error) {
    console.error('Claim badge error:', error);
    return { success: false, error: error.message };
  }
};

// Get earned badges
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

// Get all badges with earned status and progress
export const getAllBadgesWithStatus = async (familyId, hikes = []) => {
  try {
    // Get earned badges
    const result = await getEarnedBadges(familyId);
    if (!result.success) {
      return result;
    }

    const earnedBadgeIds = result.earnedBadges.map(b => b.badgeId);

    // Calculate family stats for progress
    const totalHikes = hikes.length;
    const totalDistance = hikes.reduce((sum, h) => sum + (parseFloat(h.distance) || 0), 0);
    const totalElevation = hikes.reduce((sum, h) => sum + (parseFloat(h.elevation) || 0), 0);
    const currentStreak = calculateStreak(hikes);

    const familyStats = {
      totalHikes,
      totalDistance,
      totalElevation,
      currentStreak,
    };

    // Map all badges with earned status and progress
    const allBadges = BADGES.map(badge => {
      const earned = earnedBadgeIds.includes(badge.id);
      const earnedData = result.earnedBadges.find(b => b.badgeId === badge.id);

      // Calculate progress for automatic badges
      let progress = 0;
      let progressText = '';

      if (!earned) {
        switch (badge.type) {
          case 'count':
            progress = Math.min((totalHikes / badge.requirement) * 100, 100);
            progressText = `${totalHikes}/${badge.requirement} hikes`;
            break;
          case 'distance':
            progress = Math.min((totalDistance / badge.requirement) * 100, 100);
            progressText = `${Math.round(totalDistance * 10) / 10}/${badge.requirement} mi`;
            break;
          case 'elevation':
            progress = Math.min((totalElevation / badge.requirement) * 100, 100);
            progressText = `${Math.round(totalElevation)}/${badge.requirement} ft`;
            break;
          case 'streak':
            progress = Math.min((currentStreak / badge.requirement) * 100, 100);
            progressText = `${currentStreak}/${badge.requirement} day streak`;
            break;
          default:
            progressText = 'Not earned yet';
        }
      }

      return {
        ...badge,
        earned,
        earnedData,
        progress,
        progressText,
        canClaim: ['weather', 'discovery', 'location', 'special', 'social'].includes(badge.type) && !earned,
      };
    });

    return { success: true, badges: allBadges };
  } catch (error) {
    console.error('Get all badges error:', error);
    return { success: false, error: error.message };
  }
};
