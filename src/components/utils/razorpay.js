/**
 * Load Razorpay SDK dynamically into the browser.
 * @returns {Promise<boolean>} - Resolves true if loaded, false if failed.
 */
export const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
      resolve(true); // Already loaded
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error('❌ Failed to load Razorpay SDK');
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

/**
 * Create Razorpay order on your backend.
 * @param {number} amount - Amount in INR (₹)
 * @returns {Promise<object>} - Razorpay order details or error.
 */
export const createRazorpayOrder = async (amount) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/create-razorpay-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: amount * 100 }) // Convert ₹ to paise
    });

    if (!response.ok) {
      throw new Error('Failed to create Razorpay order');
    }

    return await response.json();
  } catch (error) {
    console.error('❌ Razorpay order creation failed:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Verify Razorpay payment on your backend.
 * @param {object} paymentData - Razorpay response to verify.
 * @returns {Promise<object>} - Verification result.
 */
export const verifyPayment = async (paymentData) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/verify-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData)
    });

    if (!response.ok) {
      throw new Error('Payment verification failed');
    }

    return await response.json();
  } catch (error) {
    console.error('❌ Razorpay payment verification failed:', error.message);
    return { success: false, error: error.message };
  }
};
