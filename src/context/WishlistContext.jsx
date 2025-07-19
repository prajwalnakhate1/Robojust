import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();
export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);

  // 🔄 Load wishlist from Firestore or localStorage
  useEffect(() => {
    const loadWishlist = async () => {
      if (user) {
        const wishlistRef = doc(db, 'wishlists', user.uid);
        try {
          const snap = await getDoc(wishlistRef);
          if (snap.exists()) {
            setWishlistItems(snap.data().items || []);
          } else {
            const localItems = JSON.parse(localStorage.getItem('wishlistItems') || '[]');
            if (localItems.length > 0) {
              setWishlistItems(localItems);
              await setDoc(wishlistRef, { items: localItems }, { merge: true });
              localStorage.removeItem('wishlistItems');
            }
          }
        } catch (error) {
          console.error('❌ Failed to load wishlist from Firestore:', error.message);
        }
      } else {
        const localItems = JSON.parse(localStorage.getItem('wishlistItems') || '[]');
        setWishlistItems(localItems);
      }
    };

    loadWishlist();
  }, [user]);

  // 💾 Save wishlist to Firestore or localStorage
  useEffect(() => {
    const saveWishlist = async () => {
      try {
        if (user) {
          const wishlistRef = doc(db, 'wishlists', user.uid);
          await setDoc(wishlistRef, { items: wishlistItems }, { merge: true });
        }
        localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
      } catch (error) {
        console.error('❌ Error saving wishlist:', error.message);
      }
    };

    saveWishlist();
  }, [wishlistItems, user]);

  // ➕ Add to wishlist
  const addToWishlist = (product) => {
    setWishlistItems((prevItems) => {
      const exists = prevItems.some((item) => item.id === product.id);
      return exists ? prevItems : [...prevItems, product];
    });
  };

  // ❌ Remove from wishlist
  const removeFromWishlist = (productId) => {
    setWishlistItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };

  // ✅ Check if in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        setWishlistItems,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
