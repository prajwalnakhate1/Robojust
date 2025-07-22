// api/razorpay-webhook.js

import crypto from "crypto";

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  try {
    const payload = JSON.stringify(req.body);
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(payload)
      .digest("hex");

    const receivedSignature = req.headers["x-razorpay-signature"];

    if (expectedSignature !== receivedSignature) {
      console.error("❌ Signature mismatch");
      return res.status(400).json({ error: "Invalid signature" });
    }

    // ✅ Process the Razorpay payload
    console.log("✅ Webhook received and verified");
    console.log(req.body);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
