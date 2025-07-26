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
          amount: Math.round(amount * 100), // Paise
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
        name: options.name || 'VoltX Technologies',
        description: options.description || 'Payment for your purchase',
        image: '/logo.png',
        prefill: options.prefill || {},
        theme: options.theme || { color: '#3399cc' },
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
      { source: 'voltx_checkout' }
    );

    await initiateRazorpayPayment({
      amount,
      order_id: order.id,
      key: import.meta.env.VITE_RAZORPAY_KEY,
      description: paymentOptions.productDescription || 'Purchase',
      prefill: paymentOptions.customerDetails,
      theme: { color: paymentOptions.themeColor || '#3399cc' },
      handler: async (response) => {
        try {
          const verification = await verifyPayment(response);
          if (verification.success) {
            paymentOptions.onSuccess?.(verification.paymentId || response.razorpay_payment_id);
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
  }
};
