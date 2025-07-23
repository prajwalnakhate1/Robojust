import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './OrderConfirmation.css';
import { sendInvoiceViaWhatsApp } from '../../components/utils/whatsappUtils'; // Optional

const OrderConfirmation = ({ orderId, paymentMethod, total, invoiceURL, user }) => {
  useEffect(() => {
    if (invoiceURL && user?.phoneNumber) {
      sendInvoiceViaWhatsApp({
        phone: user.phoneNumber, // Example: '919876543210'
        amount: total * 100, // Razorpay gives in paise
        invoiceURL: invoiceURL,
        name: user.displayName || user.email,
      });
    }
  }, [invoiceURL, user, total]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10 fade-in">
      <div className="bg-white shadow-lg rounded-lg max-w-lg w-full p-8 text-center animate-slideIn">
        <h1 className="text-2xl font-bold text-green-600 mb-4">Order Confirmed!</h1>
        <p className="text-gray-700 mb-6">Thank you for your purchase</p>

        <div className="text-left mb-6 space-y-4 text-sm sm:text-base">
          <div>
            <span className="font-semibold">Order Number:</span>{' '}
            <span className="text-gray-800 break-all">{orderId}</span>
          </div>
          <div>
            <span className="font-semibold">Payment Method:</span>{' '}
            <span className="capitalize text-gray-800">
              {paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod}
            </span>
          </div>
          <div>
            <span className="font-semibold">Total Paid:</span>{' '}
            <span className="text-gray-800">₹{total?.toFixed(2)}</span>
          </div>
          {invoiceURL && (
            <div>
              <span className="font-semibold">Invoice:</span>{' '}
              <a
                href={invoiceURL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline ml-1"
              >
                Download Invoice (PDF)
              </a>
            </div>
          )}
        </div>

        <div className="text-sm sm:text-base text-gray-600 mb-6">
          We’ve sent a confirmation email with your order details.
          <br />
          Your order will be processed and shipped within{' '}
          <span className="font-medium">1–2 business days</span>.
        </div>

        <div className="flex justify-center gap-4">
          <Link
            to="/orders"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
          >
            View Order
          </Link>
          <Link
            to="/"
            className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition duration-200"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
