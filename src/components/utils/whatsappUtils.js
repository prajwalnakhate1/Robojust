/**
 * Send WhatsApp message with invoice link
 * @param {Object} params
 * @param {string} params.phone - WhatsApp number (e.g., 91XXXXXXXXXX)
 * @param {number} params.amount - Amount in paisa (₹1.30 = 130)
 * @param {string} params.invoiceURL - Firebase Storage PDF link
 * @param {string} [params.name] - Optional customer name
 */
export function sendInvoiceViaWhatsApp({ phone, amount, invoiceURL, name }) {
  if (!phone || !invoiceURL) return;

  const amountInRupees = (amount / 100).toFixed(2); // ✅ Convert to ₹

  const message = `🧾 *Invoice from RoboJust*%0A
Hello ${name || 'Customer'},%0A
Thank you for your payment of ₹${amountInRupees}.%0A
Download your invoice here:%0A${invoiceURL}%0A
_%0ARoboJust Billing Team`;

  const whatsappLink = `https://wa.me/${phone}?text=${message}`;
  window.open(whatsappLink, '_blank');
}
