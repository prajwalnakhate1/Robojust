import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext'; // 🔄 Corrected path

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from Firestore
  useEffect(() => {
    if (!user || authLoading) return;

    const fetchCart = async () => {
      try {
        const cartRef = doc(db, 'carts', user.uid);
        const snap = await getDoc(cartRef);
        if (snap.exists()) {
          setCartItems(snap.data().items || []);
        }
      } catch (error) {
        console.error("Error loading cart:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, [user, authLoading]);

  // Save cart to Firestore with debounce
  useEffect(() => {
    if (!user || authLoading || isLoading) return;

    const saveCart = async () => {
      try {
        const cartRef = doc(db, 'carts', user.uid);
        await setDoc(cartRef, { items: cartItems }, { merge: true });
      } catch (error) {
        console.error("Error saving cart:", error);
      }
    };

    const timer = setTimeout(saveCart, 500);
    return () => clearTimeout(timer);
  }, [cartItems, user, authLoading, isLoading]);

  // Add item to cart
  const addToCart = (product) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // Remove item
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Update quantity
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.min(newQuantity, item.stock || 100) }
          : item
      )
    );
  };

  // Total
  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  // Clear
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        calculateTotal,
        clearCart,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
