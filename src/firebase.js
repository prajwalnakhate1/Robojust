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

// 🔐 Firebase config (safe for frontend use)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
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
    return false;
  }
}

// ✅ Export Firebase services
export { app, auth, db, storage };
