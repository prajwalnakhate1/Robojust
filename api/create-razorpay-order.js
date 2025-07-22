// api/create-razorpay-order.js

import Razorpay from 'razorpay';

/**
 * Serverless API Route to create a Razorpay order
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { amount = 500 } = req.body; // default ₹5.00 if not passed

  try {
    // 🔐 Use environment-secured credentials
    const razorpay = new Razorpay({
      key_id: process.env.rzp_live_pogXtYgUcYpW4t,
      key_secret: process.env.	BRgy9EMqMof2B32ZCwgQnITU,
    });

    const options = {
      amount: Math.round(amount * 100), // amount in paise
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      success: true,
      razorpayOrderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });

  } catch (error) {
    console.error('❌ Razorpay order creation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create Razorpay order',
      error: error.message,
    });
  }
}
