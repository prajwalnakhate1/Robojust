<<<<<<< HEAD
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { 
  getFirestore, 
  initializeFirestore, 
  persistentLocalCache,
  CACHE_SIZE_UNLIMITED 
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
=======
// src/firebase.js

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  enableIndexedDbPersistence,
  doc,
  setDoc,
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
>>>>>>> 965054e692d1292787da422a24f0eb7af0f7c340

// 🔐 Firebase config (safe for frontend use)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
<<<<<<< HEAD
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth and Storage
const auth = getAuth(app);
const storage = getStorage(app);

// Initialize Firestore with persistent cache (updated configuration)
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    cacheSizeBytes: CACHE_SIZE_UNLIMITED
  })
});

// Connection test utility
export const testFirestoreConnection = async () => {
  try {
    const testRef = doc(db, '_connections', 'test');
    await setDoc(testRef, { timestamp: serverTimestamp() });
    return true;
  } catch (error) {
    console.error('Firestore connection failed:', error);
=======
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// ✅ Initialize Firebase services
let app, auth, db, storage;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);

  enableIndexedDbPersistence(db)
    .then(() => {
      console.log('✅ Offline persistence enabled');
    })
    .catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('⚠️ Persistence only works in one tab at a time.');
      } else if (err.code === 'unimplemented') {
        console.warn('⚠️ IndexedDB is not supported in this browser.');
      }
    });

  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
}

// ✅ Firestore Connection Test (optional)
export async function testFirestoreConnection() {
  try {
    const testDocRef = doc(db, '_test_connection', 'test');
    await setDoc(testDocRef, { timestamp: new Date() });
    console.log('✅ Firestore connection test successful');
    return true;
  } catch (error) {
    console.error('❌ Firestore connection test failed:', error);
>>>>>>> 965054e692d1292787da422a24f0eb7af0f7c340
    return false;
  }
};

<<<<<<< HEAD
export { app, auth, db, storage };
=======
// ✅ Export Firebase services
export { app, auth, db, storage };
>>>>>>> 965054e692d1292787da422a24f0eb7af0f7c340
