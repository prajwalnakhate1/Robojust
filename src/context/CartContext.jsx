// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  // 🔄 Load cart on auth state change
  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        const cartRef = doc(db, 'carts', user.uid);
        try {
          const snap = await getDoc(cartRef);
          if (snap.exists()) {
            const firestoreItems = snap.data().items || [];
            setCartItems(firestoreItems);
          } else {
            const localItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
            if (localItems.length > 0) {
              setCartItems(localItems);
              await setDoc(cartRef, { items: localItems }, { merge: true });
              localStorage.removeItem('cartItems');
            }
          }
        } catch (err) {
          console.error('Failed to load cart from Firestore:', err.message);
        }
      } else {
        const localItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
        setCartItems(localItems);
      }
    };
    loadCart();
  }, [user]);

  // 💾 Save cart to Firestore or localStorage
  useEffect(() => {
    const saveCart = async () => {
      try {
        if (user) {
          const cartRef = doc(db, 'carts', user.uid);
          await setDoc(cartRef, { items: cartItems }, { merge: true });
        }
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
      } catch (error) {
        console.error('Error saving cart:', error.message);
      }
    };
    saveCart();
  }, [cartItems, user]);

  // ➕ Add item to cart
  const addToCart = (product) => {
    if (product.stock <= 0) {
      alert(`⚠️ ${product.name} is out of stock.`);
      return;
    }

    setCartItems((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        const newQty = exists.quantity + 1;
        if (newQty > product.stock) {
          alert(`Only ${product.stock} items in stock for ${product.name}.`);
          return prev;
        }
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: newQty } : item
        );
      }

      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: Number(product.price),
          quantity: 1,
          image: product.image,
          sku: product.sku || '',
          stock: product.stock || 0,
        },
      ];
    });
  };

  // ❌ Remove item by ID
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // 💰 Calculate total
  const calculateTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // 🧹 Clear cart
  const clearCart = async () => {
    setCartItems([]);
    if (user) {
      try {
        const cartRef = doc(db, 'carts', user.uid);
        await setDoc(cartRef, { items: [] }, { merge: true });
      } catch (err) {
        console.error('Error clearing Firestore cart:', err);
      }
    }
    localStorage.removeItem('cartItems');
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        calculateTotal,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
