import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { 
  getFirestore, 
  initializeFirestore, 
  persistentLocalCache,
  CACHE_SIZE_UNLIMITED 
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

// 🔐 Firebase config (safe for frontend use)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
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
    return false;
  }
};

export { app, auth, db, storage };
