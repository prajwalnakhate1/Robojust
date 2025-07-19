import React from 'react';
import { Link } from 'react-router-dom';
import './OrderConfirmation.css'; // Optional: Add this for custom styles

const OrderConfirmation = ({ orderId, paymentMethod, total }) => {
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
            <span className="text-gray-800">${total?.toFixed(2)}</span>
          </div>
        </div>

        <div className="text-sm sm:text-base text-gray-600 mb-6">
          We've sent a confirmation email with your order details.
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
