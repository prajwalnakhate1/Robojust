import React from 'react';
import { FiCheck, FiEdit2 } from 'react-icons/fi';
import './ReviewStep.css';

const ReviewStep = ({
  cartItems = [],
  selectedAddress,
  paymentMethod,
  subtotal = 0,
  shipping = 0,
  tax = 0,
  total = 0,
  onPlaceOrder,
  loading = false,
  onEditAddress,
  onEditPayment,
}) => {
  const itemCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <section className="review-step-section">
      <h2 className="text-2xl font-bold mb-6 text-center">🛒 Review Your Order</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Panel */}
        <div className="md:col-span-2 space-y-6">
          {/* Shipping Address */}
          <div className="info-card">
            <div className="card-header flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">Shipping Address</h3>
              <button
                onClick={onEditAddress}
                className="edit-button text-blue-600 hover:underline flex items-center gap-1"
              >
                <FiEdit2 className="edit-icon" />
                Change
              </button>
            </div>
            {selectedAddress ? (
              <address className="address-details not-italic text-sm leading-6 text-gray-700">
                <p>{selectedAddress.name}</p>
                <p>{selectedAddress.street}</p>
                <p>
                  {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zip}
                </p>
                <p>📞 {selectedAddress.phone}</p>
                {selectedAddress.isDefault && (
                  <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
                    Default
                  </span>
                )}
              </address>
            ) : (
              <p className="text-red-500 text-sm">No address selected.</p>
            )}
          </div>

          {/* Payment Method */}
          <div className="info-card">
            <div className="card-header flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">Payment Method</h3>
              <button
                onClick={onEditPayment}
                className="edit-button text-blue-600 hover:underline flex items-center gap-1"
              >
                <FiEdit2 className="edit-icon" />
                Change
              </button>
            </div>
            <p className="text-sm text-gray-700">
              {paymentMethod === 'credit-card'
                ? 'Credit/Debit Card'
                : paymentMethod === 'razorpay'
                ? 'Razorpay'
                : 'Cash on Delivery'}
            </p>
          </div>

          {/* Order Items */}
          <div className="info-card">
            <h3 className="text-lg font-semibold mb-4">Order Items</h3>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="order-item flex justify-between items-center border-b pb-3"
                >
                  <div className="item-info flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-contain rounded border"
                    />
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity || 1}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-sm">
                    ₹{(item.price * (item.quantity || 1)).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Order Summary */}
        <aside className="order-summary sticky top-4 bg-white p-6 rounded-lg shadow-md space-y-4">
          <h3 className="text-lg font-semibold mb-2">🧾 Order Summary</h3>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Subtotal ({itemCount} item{itemCount !== 1 ? 's' : ''})</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>₹{shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <hr className="border-t my-2" />
            <div className="flex justify-between font-bold text-base">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={onPlaceOrder}
            disabled={loading}
            className={`w-full py-3 mt-4 rounded-md font-semibold text-white transition duration-300 ${
              loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Processing...' : (
              <span className="flex items-center justify-center gap-2">
                <FiCheck className="text-white" />
                Place Order
              </span>
            )}
          </button>

          <p className="text-xs text-center text-gray-500 mt-3">
            By placing your order, you agree to Robojust’s{' '}
            <a href="/terms" className="text-blue-600 underline">Terms</a> &
            <a href="/privacy" className="text-blue-600 underline ml-1">Privacy Policy</a>.
          </p>
        </aside>
      </div>
    </section>
  );
};

export default ReviewStep;
