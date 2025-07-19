import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  addDoc,
} from 'firebase/firestore';
import { db } from '../firebase';

export const useCheckoutLogic = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, clearCart, calculateTotal } = useCart();

  const [address, setAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [error, setError] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const totalAmount = calculateTotal();

  // ✅ Fetch default address from users/{uid}/addresses
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        if (!user) return;

        const q = query(
          collection(db, 'users', user.uid, 'addresses'),
          where('isDefault', '==', true)
        );
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          setAddress({ id: doc.id, ...doc.data() });
        } else {
          setError('No default address found.');
        }
      } catch (err) {
        console.error('❌ Error fetching address:', err.message);
        setError('Failed to load address.');
      }
    };

    fetchAddress();
  }, [user]);

  // 💳 Handle payment method selection
  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  // 🧾 Place Order Logic
  const handlePlaceOrder = async () => {
    setError(null);

    if (!user) {
      setError('User not authenticated.');
      navigate('/login');
      return;
    }

    if (!address) {
      setError('Shipping address not available.');
      return;
    }

    if (cartItems.length === 0) {
      setError('Cart is empty.');
      return;
    }

    setIsPlacingOrder(true);

    try {
      const orderData = {
        userId: user.uid,
        items: cartItems.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          productId: item.id,
          image: item.image,
          sku: item.sku || '',
        })),
        pricing: {
          subtotal: totalAmount,
          discount: 0,
          giftWrap: 0,
          total: totalAmount,
        },
        paymentInfo: {
          method: paymentMethod,
          status: paymentMethod === 'cod' ? 'pending' : 'processing',
          transactionId: '',
        },
        shippingInfo: {
          addressId: address.id || '',
          instructions: '',
        },
        status: 'processing',
        statusHistory: [
          {
            status: 'processing',
            timestamp: new Date().toISOString(),
            notes: 'Order placed by user',
          },
        ],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // ✅ Save order in Firestore
      const docRef = await addDoc(collection(db, 'orders'), orderData);

      // Optional: Add order tracking
      await setDoc(doc(db, 'orderTracking', docRef.id), {
        status: 'processing',
        updates: [
          {
            status: 'processing',
            timestamp: new Date().toISOString(),
            details: 'Order placed by user',
          },
        ],
        lastUpdated: serverTimestamp(),
      });

      clearCart();
      navigate(`/order-confirmation/${docRef.id}`);
    } catch (err) {
      console.error('❌ Error placing order:', err.message);
      setError('Order placement failed. Try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return {
    user,
    address,
    paymentMethod,
    totalAmount,
    error,
    isPlacingOrder,
    handlePlaceOrder,
    handlePaymentMethodChange,
  };
};
