const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

// ✅ Log function initialization
functions.logger.info("⚙️ Firebase Functions Initialized");

// Initialize Express App
const app = express();

// ✅ Middleware
app.use(cors({origin: true}));
app.use(express.json()); // Parses incoming JSON requests

// ✅ Razorpay Webhook Endpoint
app.post("/razorpay/webhook", async (req, res) => {
  try {
    const payload = req.body;
    functions.logger.info("📦 Webhook Payload Received:", payload);

    const paymentEntity =
      payload &&
      payload.payload &&
      payload.payload.payment &&
      payload.payload.payment.entity;

    if (!paymentEntity || !paymentEntity.id) {
      functions.logger.warn("❌ Invalid webhook structure");
      return res.status(400).send("Invalid payload");
    }

    // ✅ Save Payment Data to Firestore
    await db.collection("orders").add({
      razorpayPaymentId: paymentEntity.id,
      orderId: paymentEntity.order_id || "N/A",
      email: paymentEntity.email || "N/A",
      contact: paymentEntity.contact || "N/A",
      amount: paymentEntity.amount / 100, // Convert paise to INR
      currency: paymentEntity.currency,
      status: paymentEntity.status,
      method: paymentEntity.method || "N/A",
      captured: paymentEntity.captured || false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(200).send("✅ Webhook handled successfully");
  } catch (error) {
    functions.logger.error("❌ Error handling webhook:", error);
    return res.status(500).send("Server Error");
  }
});

// ✅ Export the Cloud Function
exports.razorpayWebhook = functions.https.onRequest(app);
