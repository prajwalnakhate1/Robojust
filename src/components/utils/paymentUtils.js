import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase'; // 🔁 Adjust if your path differs

// 🧾 Save order to Firestore after successful Razorpay payment
export const saveOrderToFirestore = async (orderId, orderData) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await setDoc(orderRef, {
      ...orderData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.error('❌ Error saving order to Firestore:', error.message);
    return false;
  }
};

// 💳 Razorpay payment initiation handler
export const initiateRazorpayPayment = (orderDetails, onSuccess, onFailure) => {
  if (typeof window === 'undefined' || !window.Razorpay) {
    alert('❌ Razorpay SDK is not loaded. Check your script tag or internet.');
    return;
  }

  // 🔐 Razorpay API Key from .env file
  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY || process.env.REACT_APP_RAZORPAY_KEY;
  if (!razorpayKey) {
    console.error('⚠️ Razorpay Key is missing from environment variables');
    alert('Payment configuration error. Please contact support.');
    return;
  }

  const options = {
    key: razorpayKey,
    amount: Math.round(orderDetails.amount * 100), // convert to paise
    currency: 'INR',
    name: 'VoltX Technologies', // Replace with your brand
    description: 'Secure Payment',
    image: '/logo.png', // Optional: logo file path
    order_id: orderDetails.razorpayOrderId, // Must come from your backend
    handler: function (response) {
      /**
       * response = {
       *   razorpay_payment_id,
       *   razorpay_order_id,
       *   razorpay_signature
       * }
       */
      if (onSuccess) onSuccess(response);
    },
    prefill: {
      name: orderDetails.customerName || '',
      email: orderDetails.customerEmail || '',
      contact: orderDetails.customerPhone || '',
    },
    notes: {
      orderId: orderDetails.orderId || '',
      customNote: orderDetails.notes || '',
    },
    theme: {
      color: '#2D89FF', // Match with your theme
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();

  rzp.on('payment.failed', function (response) {
    if (onFailure) onFailure(response.error);
    console.error('❌ Razorpay Payment Failed:', response.error);
  });
};
