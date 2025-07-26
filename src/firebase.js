import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAHnzFBq49KOJlsixDdOAJEATo-kWqwPmw",
  authDomain: "ecommerce-site-2bfbe.firebaseapp.com",
  projectId: "ecommerce-site-2bfbe",
  storageBucket: "ecommerce-site-2bfbe.appspot.com",
  messagingSenderId: "1078965716895",
  appId: "1:1078965716895:web:5d371acf3b6bd1bd719faa",
  measurementId: "G-09XSK8DBN6"
};

// Initialize Firebase services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Enable offline persistence
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Offline persistence already enabled in another tab');
    } else if (err.code === 'unimplemented') {
      console.warn('Browser does not support offline persistence');
    }
  });
}

export { app, auth, db, storage };

// Connection test utility
export const testFirestoreConnection = async () => {
  try {
    const testRef = doc(db, '_connections', 'test');
    await setDoc(testRef, { timestamp: new Date() });
    return true;
  } catch (error) {
    console.error('Firestore connection failed:', error);
    return false;
  }
};