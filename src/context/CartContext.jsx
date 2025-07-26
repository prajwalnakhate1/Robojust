import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Format price as Indian Rupees
  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // 🔄 Load cart on auth state change
  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      try {
        if (user) {
          const cartRef = doc(db, 'carts', user.uid);
          const snap = await getDoc(cartRef);
          
          if (snap.exists()) {
            setCartItems(snap.data().items || []);
          } else {
            const localItems = JSON.parse(localStorage.getItem('cart') || '[]');
            if (localItems.length > 0) {
              setCartItems(localItems);
              await setDoc(cartRef, { items: localItems });
              localStorage.removeItem('cart');
            }
          }
        } else {
          const localItems = JSON.parse(localStorage.getItem('cart') || '[]');
          setCartItems(localItems);
        }
      } catch (error) {
        console.error('Cart load error:', error);
        toast.error('Failed to load cart');
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [user]);

  // 💾 Auto-save when cart changes
  useEffect(() => {
    const saveCart = async () => {
      try {
        if (user) {
          const cartRef = doc(db, 'carts', user.uid);
          await setDoc(cartRef, { items: cartItems });
        }
        localStorage.setItem('cart', JSON.stringify(cartItems));
      } catch (error) {
        console.error('Cart save error:', error);
        toast.error('Failed to sync cart');
      }
    };

    const timer = setTimeout(saveCart, 500);
    return () => clearTimeout(timer);
  }, [cartItems, user]);

  // ➕ Add item to cart
  const addToCart = (product) => {
    if (!product.id) return;
    
    if (product.stock <= 0) {
      toast.error(`${product.name} is out of stock`);
      return;
    }

    setCartItems(prev => {
      const exists = prev.find(item => item.id === product.id);
      
      if (exists) {
        const newQty = exists.quantity + 1;
        if (newQty > product.stock) {
          toast.error(`Only ${product.stock} items available`);
          return prev;
        }
        toast.success(`Increased ${product.name} quantity`);
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: newQty } : item
        );
      }

      toast.success(`${product.name} added to cart`);
      return [
        ...prev,
        {
          ...product,
          quantity: 1,
          price: Number(product.price)
        }
      ];
    });
  };

  // 🔢 Update item quantity (for direct input)
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1 || isNaN(newQuantity)) return;

    setCartItems(prev => 
      prev.map(item => {
        if (item.id === productId) {
          const quantity = Math.min(
            Math.max(1, newQuantity), 
            item.stock || 99
          );
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  // ➖ Decrease item quantity
  const decreaseQuantity = (productId) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // ➕ Increase item quantity
  const increaseQuantity = (productId) => {
    setCartItems(prev =>
      prev.map(item => {
        if (item.id === productId) {
          const newQty = item.quantity + 1;
          const maxQty = item.stock || 99;
          if (newQty > maxQty) {
            toast.error(`Only ${maxQty} items available`);
            return item;
          }
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  // ❌ Remove item from cart
  const removeFromCart = (id) => {
    setCartItems(prev => {
      const removedItem = prev.find(item => item.id === id);
      if (removedItem) {
        toast.success(`${removedItem.name} removed from cart`);
      }
      return prev.filter(item => item.id !== id);
    });
  };

  // 💰 Calculate totals in INR
  const calculateTotals = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.18; // 18% GST
    const shipping = subtotal > 1000 ? 0 : 99; // Free shipping over ₹1000
    const total = subtotal + tax + shipping;

    return {
      raw: { subtotal, tax, shipping, total },
      formatted: {
        subtotal: formatPrice(subtotal),
        tax: formatPrice(tax),
        shipping: shipping === 0 ? 'FREE' : formatPrice(shipping),
        total: formatPrice(total)
      },
      count: cartItems.reduce((sum, item) => sum + item.quantity, 0)
    };
  };

  // 🧹 Clear cart completely
  const clearCart = async () => {
    setCartItems([]);
    try {
      if (user) {
        const cartRef = doc(db, 'carts', user.uid);
        await setDoc(cartRef, { items: [] });
      }
      localStorage.removeItem('cart');
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  // 🔄 Merge guest cart after login
  const mergeGuestCart = async (guestItems) => {
    if (!user || !guestItems.length) return;
    
    try {
      const cartRef = doc(db, 'carts', user.uid);
      const currentCart = await getDoc(cartRef);
      const existingItems = currentCart.exists() ? currentCart.data().items : [];

      const mergedItems = [...existingItems];
      guestItems.forEach(guestItem => {
        const existingIndex = mergedItems.findIndex(item => item.id === guestItem.id);
        if (existingIndex >= 0) {
          mergedItems[existingIndex].quantity = Math.max(
            mergedItems[existingIndex].quantity,
            guestItem.quantity
          );
        } else {
          mergedItems.push(guestItem);
        }
      });

      await setDoc(cartRef, { items: mergedItems });
      setCartItems(mergedItems);
    } catch (error) {
      console.error('Cart merge error:', error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        decreaseQuantity,
        increaseQuantity,
        updateQuantity,
        removeFromCart,
        calculateTotals,
        clearCart,
        mergeGuestCart,
        formatPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
};