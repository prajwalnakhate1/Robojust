/**
 * Dynamically load the Razorpay SDK into the browser.
 * @returns {Promise<boolean>} Resolves to true if loaded successfully.
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
 * Call the backend API to create a Razorpay order.
 * @param {number} amount - Amount in ₹ (e.g., 500 for ₹500)
 * @returns {Promise<object>} - Response from API
 */
export const createRazorpayOrder = async (amount) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/create-razorpay-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: Math.round(amount * 100) }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create order');
    return data;
  } catch (error) {
    console.error('❌ Razorpay order creation failed:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Open Razorpay popup and handle payment flow.
 * @param {object} orderDetails - { amount, razorpayOrderId, customerName, customerEmail, customerPhone, orderId }
 * @param {function} onSuccess - Callback on success
 * @param {function} onFailure - Callback on failure
 */
export const initiateRazorpayPayment = (orderDetails, onSuccess, onFailure) => {
  if (typeof window === 'undefined' || !window.Razorpay) {
    alert('❌ Razorpay SDK not loaded');
    return;
  }

  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY;
  if (!razorpayKey) {
    console.error('⚠️ Razorpay key not set');
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
    theme: { color: '#2D89FF' },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();

  rzp.on('payment.failed', (response) => {
    if (onFailure) onFailure(response.error);
    console.error('❌ Payment Failed:', response.error);
  });
};

/**
 * Verify Razorpay payment with your backend.
 * @param {object} paymentData - { razorpay_payment_id, razorpay_order_id, razorpay_signature }
 * @returns {Promise<object>} - API response
 */
export const verifyPayment = async (paymentData) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/verify-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Verification failed');
    return data;
  } catch (error) {
    console.error('❌ Payment verification error:', error.message);
    return { success: false, error: error.message };
  }
};
