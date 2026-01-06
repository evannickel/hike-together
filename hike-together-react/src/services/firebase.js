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
