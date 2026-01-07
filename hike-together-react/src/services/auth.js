import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  deleteUser,
} from 'firebase/auth';
import { doc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { auth, analytics, db } from './firebase';
import { logEvent } from 'firebase/analytics';

export const signUp = async (email, password) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    logEvent(analytics, 'sign_up', { method: 'email' });
    return { success: true, user: result.user };
  } catch (error) {
    console.error('Sign up error:', error);
    return { success: false, error: error.message };
  }
};

export const signIn = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    logEvent(analytics, 'login', { method: 'email' });
    return { success: true, user: result.user };
  } catch (error) {
    console.error('Sign in error:', error);
    return { success: false, error: error.message };
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    logEvent(analytics, 'logout');
    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    return { success: false, error: error.message };
  }
};

export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    console.error('Password reset error:', error);
    return { success: false, error: error.message };
  }
};

export const deleteAccount = async (userId, familyId) => {
  try {
    const user = auth.currentUser;
    if (!user || user.uid !== userId) {
      return { success: false, error: 'User not authenticated' };
    }

    // Delete user's family membership (if they have one)
    if (familyId) {
      // Delete all hikes added by this user
      const hikesRef = collection(db, 'families', familyId, 'hikes');
      const hikesSnapshot = await getDocs(hikesRef);
      const userHikes = hikesSnapshot.docs.filter(doc => doc.data().addedByUserId === userId);

      for (const hikeDoc of userHikes) {
        await deleteDoc(hikeDoc.ref);
      }

      // Note: We don't delete the family document itself, as other users may be in it
      // In a production app, you'd check if this user is the last member and handle accordingly
    }

    // Delete the Firebase Auth user account
    await deleteUser(user);

    logEvent(analytics, 'account_deleted');
    return { success: true };
  } catch (error) {
    console.error('Delete account error:', error);
    return { success: false, error: error.message };
  }
};
