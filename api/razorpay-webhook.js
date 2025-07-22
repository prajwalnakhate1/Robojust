import crypto from 'crypto';
import { db } from '../../src/firebase'; // ✅ Adjust if you're using aliases
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export const config = {
  api: {
    bodyParser: false, // Required for signature validation
  },
};

// 🔧 Get raw request body
const getRawBody = async (req) => {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => resolve(data));
    req.on('error', (err) => reject(err));
  });
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('❌ Missing RAZORPAY_WEBHOOK_SECRET');
    return res.status(500).json({ error: 'Webhook secret not set in environment' });
  }

  try {
    const rawBody = await getRawBody(req);
    const signature = req.headers['x-razorpay-signature'];

    // 🔐 Signature validation
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      console.warn('⚠️ Signature mismatch');
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const payload = JSON.parse(rawBody);
    const eventType = payload?.event || 'unknown';

    console.log(`✅ Webhook Event Verified: ${eventType}`);

    // 💾 Save specific events to Firestore (payment.captured)
    if (eventType === 'payment.captured') {
      const payment = payload.payload.payment.entity;

      await setDoc(doc(db, 'razorpay_webhooks', payment.id), {
        ...payment,
        event: eventType,
        receivedAt: serverTimestamp(),
      });

      console.log('✅ Payment saved in Firestore:', payment.id);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('❌ Webhook Error:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
