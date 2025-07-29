/**
<<<<<<< HEAD
 * Load Razorpay SDK dynamically into the browser.
 * @returns {Promise<boolean>} - Resolves true if loaded, false if failed.
=======
 * Dynamically load the Razorpay SDK into the browser.
 * @returns {Promise<boolean>} Resolves to true if loaded successfully.
>>>>>>> 965054e692d1292787da422a24f0eb7af0f7c340
 */
export const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
<<<<<<< HEAD
      resolve(true); // Already loaded
=======
      resolve(true);
>>>>>>> 965054e692d1292787da422a24f0eb7af0f7c340
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
<<<<<<< HEAD
    script.onload = () => resolve(true);
=======
    script.async = true;

    script.onload = () => {
      console.log('✅ Razorpay SDK loaded');
      resolve(true);
    };

>>>>>>> 965054e692d1292787da422a24f0eb7af0f7c340
    script.onerror = () => {
      console.error('❌ Failed to load Razorpay SDK');
      resolve(false);
    };
<<<<<<< HEAD
    document.body.appendChild(script);
=======

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
>>>>>>> 965054e692d1292787da422a24f0eb7af0f7c340
  });
};

/**
<<<<<<< HEAD
 * Create Razorpay order on backend server.
 * @param {number} amount - Amount in INR
 * @param {string} [currency='INR'] - Currency
 * @param {string} [receipt] - Receipt number
 * @param {Object} [notes] - Extra notes
 * @returns {Promise<Object>} - Razorpay order data
 */
export const createRazorpayOrder = async (amount, currency = 'INR', receipt, notes) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL || ''}/api/create-razorpay-order`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to paise
          currency,
          receipt,
          notes,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Order creation failed: ${response.status}`);
    }

    const data = await response.json();
    if (!data.id) throw new Error('Invalid Razorpay order response');

    return data;
  } catch (error) {
    console.error('❌ Razorpay order creation failed:', error);
    throw error;
  }
};

/**
 * Verify Razorpay payment on backend.
 * @param {Object} paymentData - Response from Razorpay
 * @returns {Promise<Object>} - Verification result
 */
export const verifyPayment = async (paymentData) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL || ''}/api/verify-payment`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
        },
        body: JSON.stringify(paymentData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Payment verification failed');
    }

    return await response.json();
  } catch (error) {
    console.error('❌ Payment verification failed:', error);
    return {
      success: false,
      error: error.message || 'Verification error',
    };
  }
};

/**
 * Launch Razorpay payment modal
 * @param {Object} options - Razorpay options
 * @returns {Promise<void>}
 */
export const initiateRazorpayPayment = async (options) => {
  try {
    const isLoaded = await loadRazorpay();
    if (!isLoaded) throw new Error('Razorpay SDK failed to load');

    return new Promise((resolve, reject) => {
      const rzp = new window.Razorpay({
        key: options.key,
        amount: Math.round(options.amount * 100),
        currency: options.currency || 'INR',
        order_id: options.order_id,
        name: options.name || 'Robojust',
        description: options.description || 'Purchase from Robojust',
        image: '/logo.png',
        prefill: options.prefill || {},
        theme: options.theme || { color: '#0d6efd' },
        handler: (response) => {
          options.handler?.(response);
          resolve();
        },
        modal: {
          ondismiss: () => {
            options.modal?.ondismiss?.();
            reject(new Error('Payment window closed by user'));
          },
        },
      });

      rzp.on('payment.failed', (response) => {
        reject(
          new Error(response.error?.description || 'Payment failed. Please try again.')
        );
      });

      rzp.open();
    });
  } catch (error) {
    console.error('❌ Payment initiation error:', error);
    throw error;
  }
};

/**
 * Complete Razorpay payment flow: order → modal → verify
 * @param {number} amount - Amount in INR
 * @param {Object} paymentOptions - Options for customer, success, fail
 */
export const completeRazorpayPaymentFlow = async (amount, paymentOptions) => {
  try {
    const order = await createRazorpayOrder(
      amount,
      'INR',
      `order_${Date.now()}`,
      { source: 'robojust_checkout' }
    );

    await initiateRazorpayPayment({
      amount,
      order_id: order.id,
      key: import.meta.env.VITE_RAZORPAY_KEY,
      description: paymentOptions.productDescription || 'Robotics Purchase',
      prefill: paymentOptions.customerDetails,
      theme: { color: paymentOptions.themeColor || '#0d6efd' },
      handler: async (response) => {
        try {
          const verification = await verifyPayment(response);
          if (verification.success) {
            paymentOptions.onSuccess?.(
              verification.paymentId || response.razorpay_payment_id
            );
          } else {
            paymentOptions.onFailure?.({
              code: 'VERIFICATION_FAILED',
              message: verification.error || 'Verification failed',
            });
          }
        } catch (error) {
          paymentOptions.onFailure?.({
            code: 'VERIFICATION_ERROR',
            message: error.message || 'Payment verification error',
          });
        }
      },
      modal: {
        ondismiss: paymentOptions.onModalClose,
      },
    });
  } catch (error) {
    paymentOptions.onFailure?.({
      code: 'PAYMENT_FLOW_ERROR',
      message: error.message || 'Payment process failed',
    });
=======
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
>>>>>>> 965054e692d1292787da422a24f0eb7af0f7c340
  }
};
