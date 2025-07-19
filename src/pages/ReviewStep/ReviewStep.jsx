import React from 'react';
import { FiCheck, FiEdit2 } from 'react-icons/fi';
import './ReviewStep.css';

const ReviewStep = ({
  cartItems,
  selectedAddress,
  paymentMethod,
  orderNotes,
  setOrderNotes,
  subtotal,
  shipping,
  tax,
  total,
  onPlaceOrder,
  loading,
  onEditAddress,
  onEditPayment,
}) => {
  const itemCount = cartItems?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0;

  return (
    <div className="review-step-section py-6">
      <h2 className="text-xl font-bold mb-6">Review Your Order</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Panel */}
        <section className="md:col-span-2 space-y-6" aria-label="Order details">
          {/* Shipping Address */}
          <div className="border rounded-lg p-4 bg-white shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-medium text-lg">Shipping Address</h3>
              <button
                type="button"
                onClick={onEditAddress}
                className="text-blue-600 hover:underline flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                aria-label="Change shipping address"
              >
                <FiEdit2 className="mr-1" />
                Change
              </button>
            </div>
            {selectedAddress ? (
              <address className="not-italic space-y-1">
                <p>{selectedAddress.name}</p>
                <p>{selectedAddress.street}</p>
                <p>
                  {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zip}
                </p>
                <p>Phone: {selectedAddress.phone}</p>
                {selectedAddress.isDefault && (
                  <span className="inline-block mt-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                    Default
                  </span>
                )}
              </address>
            ) : (
              <p className="text-red-500">No address selected.</p>
            )}
          </div>

          {/* Payment Method */}
          <div className="border rounded-lg p-4 bg-white shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-medium text-lg">Payment Method</h3>
              <button
                type="button"
                onClick={onEditPayment}
                className="text-blue-600 hover:underline flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                aria-label="Change payment method"
              >
                <FiEdit2 className="mr-1" />
                Change
              </button>
            </div>
            <p className="capitalize">
              {paymentMethod === 'credit-card'
                ? 'Credit/Debit Card'
                : paymentMethod === 'razorpay'
                ? 'Razorpay'
                : 'Cash on Delivery'}
            </p>
          </div>

          {/* Order Items */}
          <div className="border rounded-lg p-4 bg-white shadow-sm">
            <h3 className="font-medium mb-3 text-lg">Order Items</h3>
            <div className="space-y-4 max-h-96 overflow-auto">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border-b pb-3 last:border-b-0"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-contain rounded bg-gray-50"
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity || 1}</p>
                    </div>
                  </div>
                  <p className="font-medium">₹{(item.price * (item.quantity || 1)).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Notes */}
          <div className="border rounded-lg p-4 bg-white shadow-sm">
            <h3 className="font-medium mb-3 text-lg">Order Notes</h3>
            <textarea
              placeholder="Any special instructions?"
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              rows={3}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              aria-label="Order notes"
            />
          </div>
        </section>

        {/* Right Panel - Order Summary */}
        <aside
          className="border rounded-lg p-4 bg-white shadow-md h-fit sticky top-4 order-summary"
          aria-label="Order summary"
        >
          <h3 className="font-medium mb-4 text-lg">Order Summary</h3>
          <div className="space-y-3">
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
            <div className="border-t my-2"></div>
            <div className="flex justify-between font-medium text-lg">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onPlaceOrder}
            disabled={loading}
            className={`w-full mt-6 py-3 rounded-lg text-white font-medium flex items-center justify-center transition ${
              loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
            aria-disabled={loading}
            aria-busy={loading}
          >
            {loading ? (
              'Processing...'
            ) : (
              <>
                <FiCheck className="mr-2" />
                Place Order
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 mt-4">
            By placing your order, you agree to VoltX&apos;s Terms of Service and Privacy Policy.
          </p>
        </aside>
      </div>
    </div>
  );
};

export default ReviewStep;
