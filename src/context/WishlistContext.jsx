import { useState, useEffect, useContext, createContext, useRef } from 'react';
import { doc, getDoc, setDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const WishlistContext = createContext();
export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const notificationLock = useRef(false);

  // Centralized notification control
  const showWishlistNotification = (message, type = 'success') => {
    if (notificationLock.current) return;
    
    notificationLock.current = true;
    toast.dismiss('wishlist-notification');
    
    toast[type](message, {
      toastId: 'wishlist-notification',
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      onClose: () => {
        notificationLock.current = false;
      }
    });
  };

  // Load wishlist
  useEffect(() => {
    const loadWishlist = async () => {
      setLoading(true);
      try {
        if (user) {
          const wishlistRef = doc(db, 'wishlists', user.uid);
          const snap = await getDoc(wishlistRef);
          
          if (snap.exists()) {
            setWishlistItems(snap.data().items || []);
          } else {
            const localItems = JSON.parse(localStorage.getItem('wishlist')) || [];
            if (localItems.length > 0) {
              await setDoc(wishlistRef, { items: localItems });
              localStorage.removeItem('wishlist');
            }
            setWishlistItems(localItems);
          }
        } else {
          setWishlistItems(JSON.parse(localStorage.getItem('wishlist') || []));
        }
      } catch (error) {
        console.error('Wishlist load error:', error);
        showWishlistNotification('Failed to load wishlist', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, [user]);

  // Save wishlist changes
  useEffect(() => {
    const saveWishlist = async () => {
      try {
        if (user) {
          const wishlistRef = doc(db, 'wishlists', user.uid);
          await setDoc(wishlistRef, { items: wishlistItems });
        }
        localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
      } catch (error) {
        console.error('Wishlist save error:', error);
      }
    };

    const timer = setTimeout(saveWishlist, 500);
    return () => clearTimeout(timer);
  }, [wishlistItems, user]);

  const addToWishlist = async (product) => {
    if (!product.id || loading) return;

    setWishlistItems(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        showWishlistNotification('Item already in wishlist', 'info');
        return prev;
      }
      showWishlistNotification('Added to wishlist');
      return [...prev, product];
    });
  };

  const removeFromWishlist = async (productId) => {
    if (loading) return;

    setWishlistItems(prev => {
      const updated = prev.filter(item => item.id !== productId);
      if (updated.length !== prev.length) {
        showWishlistNotification('Removed from wishlist');
      }
      return updated;
    });
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        loading
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};