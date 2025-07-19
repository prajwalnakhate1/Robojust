  import { createContext, useContext, useState, useEffect } from 'react';
  import { auth } from '../firebase';
  import {
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
  } from 'firebase/auth';

  // Create the context
  const AuthContext = createContext(null);

  // AuthProvider component
  export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      // Listen for auth state changes
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false);

        if (firebaseUser) {
          console.log('✅ Logged in as:', firebaseUser.email);
        } else {
          console.log('⚠️ No user logged in');
        }
      });

      return () => unsubscribe(); // Cleanup
    }, []);

    // Auth functions
    const signup = (email, password) =>
      createUserWithEmailAndPassword(auth, email, password);

    const login = (email, password) =>
      signInWithEmailAndPassword(auth, email, password);

    const logout = () => signOut(auth);

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

  // Hook to use auth context
  export function useAuth() {
    return useContext(AuthContext);
  }
