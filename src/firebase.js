// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  enableIndexedDbPersistence,
  doc,
  setDoc,
} from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ✅ For file uploads, images, etc.

// 🔐 Firebase config (safe for frontend use)
const firebaseConfig = {
  apiKey: "AIzaSyAHnzFBq49KOJlsixDdOAJEATo-kWqwPmw",
  authDomain: "ecommerce-site-2bfbe.firebaseapp.com",
  projectId: "ecommerce-site-2bfbe",
  storageBucket: "ecommerce-site-2bfbe.appspot.com",
  messagingSenderId: "1078965716895",
  appId: "1:1078965716895:web:5d371acf3b6bd1bd719faa",
  measurementId: "G-09XSK8DBN6",
};

// ✅ Initialize Firebase services
let app, auth, db, storage;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);

  // ✅ Enable offline persistence for Firestore
  enableIndexedDbPersistence(db)
    .then(() => {
      console.log("✅ Offline persistence enabled");
    })
    .catch((err) => {
      if (err.code === "failed-precondition") {
        console.warn("⚠️ Persistence only works in one tab at a time.");
      } else if (err.code === "unimplemented") {
        console.warn("⚠️ IndexedDB is not supported in this browser.");
      }
    });

  console.log("✅ Firebase initialized successfully");
} catch (error) {
  console.error("❌ Firebase initialization error:", error);
}

// ✅ Firestore Connection Test
export async function testFirestoreConnection() {
  try {
    const testDocRef = doc(db, "_test_connection", "test");
    await setDoc(testDocRef, { timestamp: new Date() });
    console.log("✅ Firestore connection test successful");
    return true;
  } catch (error) {
    console.error("❌ Firestore connection test failed:", error);
    return false;
  }
}

// ✅ Export Firebase services for use in your app
export { app, auth, db, storage };
