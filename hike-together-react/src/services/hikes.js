import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, analytics } from './firebase';
import { logEvent } from 'firebase/analytics';

export const addHike = async (familyId, userId, hikeData, photoFile) => {
  try {
    let photoUrl = null;

    // Upload photo if provided
    if (photoFile) {
      const photoRef = ref(storage, `hikes/${familyId}/${Date.now()}_${photoFile.name}`);
      await uploadBytes(photoRef, photoFile);
      photoUrl = await getDownloadURL(photoRef);
    }

    // Add hike to Firestore
    const hikeRef = await addDoc(collection(db, 'families', familyId, 'hikes'), {
      ...hikeData,
      photoUrl,
      addedByUserId: userId,
      createdAt: serverTimestamp(),
    });

    // Increment hikes this month counter
    const familyRef = doc(db, 'families', familyId);
    const familyDoc = await getDoc(familyRef);
    const currentCount = familyDoc.data().hikesThisMonth || 0;
    await updateDoc(familyRef, {
      hikesThisMonth: currentCount + 1,
    });

    logEvent(analytics, 'hike_added');

    return { success: true, hikeId: hikeRef.id };
  } catch (error) {
    console.error('Add hike error:', error);
    return { success: false, error: error.message };
  }
};

export const updateHike = async (familyId, hikeId, hikeData, photoFile) => {
  try {
    let updateData = { ...hikeData };

    // Upload new photo if provided
    if (photoFile) {
      const photoRef = ref(storage, `hikes/${familyId}/${Date.now()}_${photoFile.name}`);
      await uploadBytes(photoRef, photoFile);
      updateData.photoUrl = await getDownloadURL(photoRef);
    }

    await updateDoc(doc(db, 'families', familyId, 'hikes', hikeId), updateData);

    logEvent(analytics, 'hike_updated');

    return { success: true };
  } catch (error) {
    console.error('Update hike error:', error);
    return { success: false, error: error.message };
  }
};

export const deleteHike = async (familyId, hikeId) => {
  try {
    await deleteDoc(doc(db, 'families', familyId, 'hikes', hikeId));

    // Decrement hikes this month counter
    const familyRef = doc(db, 'families', familyId);
    const familyDoc = await getDoc(familyRef);
    const currentCount = familyDoc.data().hikesThisMonth || 0;
    if (currentCount > 0) {
      await updateDoc(familyRef, {
        hikesThisMonth: currentCount - 1,
      });
    }

    logEvent(analytics, 'hike_deleted');

    return { success: true };
  } catch (error) {
    console.error('Delete hike error:', error);
    return { success: false, error: error.message };
  }
};

export const getHikes = async (familyId) => {
  try {
    const hikesRef = collection(db, 'families', familyId, 'hikes');
    const q = query(hikesRef, orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);

    const hikes = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { success: true, hikes };
  } catch (error) {
    console.error('Get hikes error:', error);
    return { success: false, error: error.message };
  }
};

export const canAddHike = async (familyId) => {
  try {
    const familyDoc = await getDoc(doc(db, 'families', familyId));

    if (!familyDoc.exists()) {
      return { allowed: false, error: 'Family not found' };
    }

    const familyData = familyDoc.data();
    const subscriptionStatus = familyData.subscriptionStatus || 'free';

    // Premium users can add unlimited hikes
    if (subscriptionStatus === 'premium') {
      return { allowed: true, isPremium: true };
    }

    // Free users limited to 3 hikes per month
    const hikesThisMonth = familyData.hikesThisMonth || 0;
    const limit = 3;

    if (hikesThisMonth >= limit) {
      return { allowed: false, count: hikesThisMonth, limit };
    }

    return { allowed: true, count: hikesThisMonth, limit, isPremium: false };
  } catch (error) {
    console.error('Can add hike error:', error);
    return { allowed: false, error: error.message };
  }
};

// Reset monthly hike counter (would be called by Cloud Function on 1st of month)
export const resetMonthlyHikeCount = async (familyId) => {
  try {
    await updateDoc(doc(db, 'families', familyId), {
      hikesThisMonth: 0,
    });
    return { success: true };
  } catch (error) {
    console.error('Reset hike count error:', error);
    return { success: false, error: error.message };
  }
};
