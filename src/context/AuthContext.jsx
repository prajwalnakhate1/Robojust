import {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '../firebase'; // Ensure db is exported from firebase.js

// Create AuthContext
const AuthContext = createContext(null);

// AuthProvider Component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          let role = 'user';

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            role = userData.role || 'user';
          } else {
            // Create user doc if it doesn't exist
            await setDoc(userDocRef, {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || '',
              photoURL: firebaseUser.photoURL || '',
              role: 'user',
              createdAt: serverTimestamp(),
            });
          }

          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            role,
            isAdmin: role === 'admin',
          });

          console.log(`✅ Logged in: ${firebaseUser.email}, role: ${role}`);
        } catch (error) {
          console.error('❌ Error loading user data:', error);
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            role: 'user',
            isAdmin: false,
          });
        }
      } else {
        setUser(null);
        console.log('⚠️ No user is logged in');
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Auth functions
  const signup = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const logout = () => firebaseSignOut(auth);

  const resetPassword = (email) =>
    sendPasswordResetEmail(auth, email);

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <div className="text-center py-6">Loading...</div>}
    </AuthContext.Provider>
  );
}

// Hook to use AuthContext
export function useAuth() {
  return useContext(AuthContext);
}
