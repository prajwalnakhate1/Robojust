import crypto from 'crypto';
import nodemailer from 'nodemailer';
import PDFDocument from 'pdfkit';
import { db } from '../src/firebase/firestore.js';


import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { db } from '../src/firebase/firestore.js'; // ✅ with .js

import { sendInvoiceToWhatsApp } from '../../src/components/utils/whatsappUtils';

export const config = { api: { bodyParser: false } };

// ✅ Server-side Firebase init
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// 🔄 Get raw body from request
const getRawBody = (req) =>
  new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) return res.status(500).json({ error: 'Missing webhook secret' });

  try {
    const rawBody = await getRawBody(req);
    const signature = req.headers['x-razorpay-signature'];
    const expectedSignature = crypto.createHmac('sha256', webhookSecret).update(rawBody).digest('hex');

    if (expectedSignature !== signature) {
      console.warn('❌ Invalid Razorpay Signature');
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const payload = JSON.parse(rawBody);
    const eventType = payload.event;

    console.log(`✅ Webhook Event: ${eventType}`);

    if (eventType === 'payment.captured') {
      const payment = payload.payload.payment.entity;

      // ✅ Generate PDF invoice
      const pdfBuffer = await generateInvoice(payment);

      // ✅ Upload to Firebase Storage
      const invoiceRef = ref(storage, `invoices/${payment.id}.pdf`);
      await uploadBytes(invoiceRef, pdfBuffer, { contentType: 'application/pdf' });
      const downloadURL = await getDownloadURL(invoiceRef);

      // ✅ Save to Firestore
      await setDoc(doc(db, 'razorpay_webhooks', payment.id), {
        ...payment,
        event: eventType,
        invoiceURL: downloadURL,
        receivedAt: serverTimestamp(),
      });

      // ✅ Email invoice
      if (payment.email) {
        await sendInvoice(payment.email, pdfBuffer, payment.id);
        console.log(`📧 Invoice sent to ${payment.email}`);
      }

      // ✅ WhatsApp Message (Optional: to admin)
      if (payment.contact) {
        await sendInvoiceToWhatsApp({
          phone: `91${payment.contact}`, // E.164 format
          name: payment.email || 'Customer',
          amount: payment.amount,
          invoiceURL: downloadURL,
        });
      }
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('❌ Webhook Error:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

// 🧾 Generate PDF Invoice
async function generateInvoice(payment) {
  const doc = new PDFDocument();
  const buffers = [];

  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', () => {});

  doc.fontSize(18).text('🧾 RoboJust Invoice', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Invoice ID: ${payment.id}`);
  doc.text(`Amount Paid: ₹${(payment.amount / 100).toFixed(2)}`);
  doc.text(`Customer Email: ${payment.email}`);
  doc.text(`Contact: ${payment.contact || 'N/A'}`);
  doc.text(`Date: ${new Date(payment.created_at * 1000).toLocaleString()}`);
  doc.text(`Payment Method: ${payment.method || 'N/A'}`);
  doc.text(`Payment Status: ${payment.status}`);
  doc.end();

  return new Promise((resolve) =>
    doc.on('end', () => resolve(Buffer.concat(buffers)))
  );
}

// 📧 Email Invoice
async function sendInvoice(to, pdfBuffer, paymentId) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_PASS,
    },
  });

  await transporter.sendMail({
    from: `"RoboJust Billing" <${process.env.SENDER_EMAIL}>`,
    to,
    subject: `🧾 RoboJust Invoice – #${paymentId}`,
    text: `Thank you for your payment! Please find your invoice attached.`,
    attachments: [
      {
        filename: `invoice-${paymentId}.pdf`,
        content: pdfBuffer,
      },
    ],
  });
}
