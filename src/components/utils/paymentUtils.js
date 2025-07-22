import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase'; // Adjust path if needed

/**
 * Load Razorpay SDK dynamically into the browser.
 * @returns {Promise<boolean>} Resolves true if SDK loaded successfully, else false.
 */
export const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;

    script.onload = () => {
      console.log('✅ Razorpay SDK loaded');
      resolve(true);
    };

    script.onerror = () => {
      console.error('❌ Failed to load Razorpay SDK');
      resolve(false);
    };

    document.body.appendChild(script);
  });
};

/**
 * Create Razorpay order by calling backend API.
 * @param {number} amount - Amount in INR (e.g., 500 for ₹500)
 * @returns {Promise<object>} API response containing order info or error
 */
export const createRazorpayOrder = async (amount) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/create-razorpay-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: Math.round(amount * 100) }), // convert ₹ to paise
    });

    if (!response.ok) {
      throw new Error(`Failed to create Razorpay order: ${response.statusText}`);
    }

    const data = await response.json();
    return data; // { success: true, order: {...} }
  } catch (error) {
    console.error('❌ Razorpay order creation error:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Initiate Razorpay payment popup.
 * @param {object} orderDetails - Contains amount, razorpayOrderId, customer info, etc.
 * @param {function} onSuccess - Callback on payment success
 * @param {function} onFailure - Callback on payment failure
 */
export const initiateRazorpayPayment = (orderDetails, onSuccess, onFailure) => {
  if (typeof window === 'undefined' || !window.Razorpay) {
    alert('❌ Razorpay SDK is not loaded.');
    return;
  }

  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY || process.env.REACT_APP_RAZORPAY_KEY;
  if (!razorpayKey) {
    console.error('⚠️ Razorpay API key missing.');
    alert('Payment configuration error. Contact support.');
    return;
  }

  const options = {
    key: razorpayKey,
    amount: Math.round(orderDetails.amount * 100),
    currency: 'INR',
    name: 'Robojust Technology',
    description: 'Secure Payment',
    image: '/logo.png',
    order_id: orderDetails.razorpayOrderId,
    handler: (response) => {
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
      color: '#2D89FF',
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();

  rzp.on('payment.failed', function (response) {
    if (onFailure) onFailure(response.error);
    console.error('❌ Razorpay payment failed:', response.error);
  });
};

/**
 * Verify Razorpay payment by calling backend API.
 * @param {object} paymentData - { razorpay_payment_id, razorpay_order_id, razorpay_signature }
 * @returns {Promise<object>} Verification response from backend
 */
export const verifyPayment = async (paymentData) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/verify-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      throw new Error(`Payment verification failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('❌ Razorpay payment verification error:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Save order details to Firestore.
 * @param {string} orderId - Your order ID (can be razorpay_order_id)
 * @param {object} orderData - Order/payment details to save
 * @returns {Promise<boolean>} True if saved successfully, else false
 */
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
