/**
 * Load Razorpay SDK dynamically into the browser.
 * @returns {Promise<boolean>} - Resolves true if loaded successfully, false otherwise.
 */
export const loadRazorpay = () => {
  return new Promise((resolve) => {
    // If SDK already loaded, resolve immediately
    if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
      resolve(true);
      return;
    }

    // Create script tag for Razorpay SDK
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
 * Create Razorpay order on your backend server.
 * @param {number} amount - Amount in INR (₹), e.g., 500 for ₹500
 * @returns {Promise<object>} - Returns object with { success, order, error }
 */
export const createRazorpayOrder = async (amount) => {
  try {
    // Multiply by 100 to convert ₹ to paise
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/create-razorpay-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: Math.round(amount * 100) }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create order: ${response.statusText}`);
    }

    const data = await response.json();
    // Expected: { success: true, order: { id: 'order_XXXX', ... } }
    return data;
  } catch (error) {
    console.error('❌ Razorpay order creation error:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Initiate Razorpay payment popup.
 * @param {object} orderDetails - Contains amount, razorpayOrderId, customer info, etc.
 * @param {function} onSuccess - Callback on payment success (response parameter)
 * @param {function} onFailure - Callback on payment failure (error parameter)
 */
export const initiateRazorpayPayment = (orderDetails, onSuccess, onFailure) => {
  if (typeof window === 'undefined' || !window.Razorpay) {
    alert('❌ Razorpay SDK is not loaded.');
    return;
  }

  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY || process.env.REACT_APP_RAZORPAY_KEY;
  if (!razorpayKey) {
    console.error('⚠️ Razorpay API key missing in environment variables.');
    alert('Payment configuration error. Please contact support.');
    return;
  }

  const options = {
    key: razorpayKey,
    amount: Math.round(orderDetails.amount * 100), // amount in paise
    currency: 'INR',
    name: 'Robojust',
    description: 'Secure Payment',
    image: '/logo.png', // Your logo path
    order_id: orderDetails.razorpayOrderId,
    handler: function (response) {
      // Payment success handler
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
    console.error('❌ Razorpay Payment Failed:', response.error);
  });
};

/**
 * Verify Razorpay payment by calling backend API.
 * @param {object} paymentData - Contains razorpay_payment_id, razorpay_order_id, razorpay_signature
 * @returns {Promise<object>} - Verification result { success: boolean, message: string }
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
