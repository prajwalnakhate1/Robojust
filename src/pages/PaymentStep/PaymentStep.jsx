import React from 'react';
import { FiDollarSign } from 'react-icons/fi';
import './PaymentStep.css'; // Optional: only if you're adding custom styles

const PaymentStep = ({ onNext, onBack, paymentMethod, setPaymentMethod }) => {
  return (
    <div className="checkout-step">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Select Payment Method</h2>

      <div className="space-y-6">
        {/* Razorpay Option */}
        <div
          className={`border rounded-lg p-4 transition-all duration-300 ${
            paymentMethod === 'razorpay' ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          <div className="flex items-center space-x-3 mb-2">
            <input
              type="radio"
              id="razorpay"
              name="payment"
              checked={paymentMethod === 'razorpay'}
              onChange={() => setPaymentMethod('razorpay')}
              className="h-4 w-4 text-blue-600"
            />
            <label htmlFor="razorpay" className="font-medium text-gray-800">
              Online Payment Gateway
            </label>
          </div>
          <p className="text-sm text-gray-600 ml-7">
            Secure payment via UPI, PhonePe, Google Pay, Paytm, Net Banking.
          </p>
        </div>

        {/* Cash on Delivery */}
        <div
          className={`border rounded-lg p-4 transition-all duration-300 ${
            paymentMethod === 'cod' ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              id="cod"
              name="payment"
              checked={paymentMethod === 'cod'}
              onChange={() => setPaymentMethod('cod')}
              className="h-4 w-4 text-blue-600"
            />
            <label htmlFor="cod" className="font-medium text-gray-800">
              Cash on Delivery
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100 transition"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!paymentMethod}
          className={`px-6 py-3 text-white rounded transition duration-200 ${
            paymentMethod
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Continue to Review
        </button>
      </div>
    </div>
  );
};

export default PaymentStep;
