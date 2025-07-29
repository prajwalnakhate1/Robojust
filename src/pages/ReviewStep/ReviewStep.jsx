import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { FiCheck, FiEdit2, FiPlus, FiMinus } from 'react-icons/fi';
import './ReviewStep.css';

const ReviewStep = ({
  cartItems = [],
  selectedAddress,
  paymentMethod,
<<<<<<< HEAD
  orderNotes = '',
  setOrderNotes,
  subtotal,
  shipping,
  tax,
  total,
=======
  subtotal = 0,
  shipping = 0,
  tax = 0,
  total = 0,
>>>>>>> 965054e692d1292787da422a24f0eb7af0f7c340
  onPlaceOrder,
  loading = false,
  onEditAddress,
  onEditPayment,
  updateQuantity,
}) => {
  const itemCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
<<<<<<< HEAD

  const handleIncrease = useCallback((item) => {
    if (!item.id) {
      console.error('Item missing ID:', item);
      return;
    }
    const newQuantity = (item.quantity || 1) + 1;
    updateQuantity(item.id, newQuantity);
  }, [updateQuantity]);

  const handleDecrease = useCallback((item, e) => {
    e.preventDefault(); // Prevent default button behavior
    if (!item.id) {
      console.error('Item missing ID:', item);
      return;
    }
    const newQuantity = Math.max(1, (item.quantity || 1) - 1);
    updateQuantity(item.id, newQuantity);
  }, [updateQuantity]);

  const handleIncreaseClick = (item, e) => {
    e.preventDefault();
    handleIncrease(item);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="review-step">
      <h2 className="review-step-title">Review Your Order</h2>

      <div className="review-step-container">
        {/* Left Panel */}
        <section className="order-details">
          {/* Shipping Address */}
          <div className="address-card">
            <div className="address-header">
              <h3>Shipping Address</h3>
=======

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
>>>>>>> 965054e692d1292787da422a24f0eb7af0f7c340
              <button
                onClick={onEditAddress}
<<<<<<< HEAD
                className="edit-button"
                aria-label="Change shipping address"
=======
                className="edit-button text-blue-600 hover:underline flex items-center gap-1"
>>>>>>> 965054e692d1292787da422a24f0eb7af0f7c340
              >
                <FiEdit2 className="edit-icon" />
                Change
              </button>
            </div>
            {selectedAddress ? (
<<<<<<< HEAD
              <address className="address-content">
=======
              <address className="address-details not-italic text-sm leading-6 text-gray-700">
>>>>>>> 965054e692d1292787da422a24f0eb7af0f7c340
                <p>{selectedAddress.name}</p>
                <p>{selectedAddress.street}</p>
                <p>
                  {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zip}
                </p>
                <p>📞 {selectedAddress.phone}</p>
                {selectedAddress.isDefault && (
<<<<<<< HEAD
                  <span className="default-badge">
=======
                  <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
>>>>>>> 965054e692d1292787da422a24f0eb7af0f7c340
                    Default
                  </span>
                )}
              </address>
            ) : (
<<<<<<< HEAD
              <p className="no-address">No address selected.</p>
=======
              <p className="text-red-500 text-sm">No address selected.</p>
>>>>>>> 965054e692d1292787da422a24f0eb7af0f7c340
            )}
          </div>

          {/* Payment Method */}
<<<<<<< HEAD
          <div className="payment-card">
            <div className="payment-header">
              <h3>Payment Method</h3>
=======
          <div className="info-card">
            <div className="card-header flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">Payment Method</h3>
>>>>>>> 965054e692d1292787da422a24f0eb7af0f7c340
              <button
                onClick={onEditPayment}
<<<<<<< HEAD
                className="edit-button"
                aria-label="Change payment method"
=======
                className="edit-button text-blue-600 hover:underline flex items-center gap-1"
>>>>>>> 965054e692d1292787da422a24f0eb7af0f7c340
              >
                <FiEdit2 className="edit-icon" />
                Change
              </button>
            </div>
<<<<<<< HEAD
            <p className="payment-method">
=======
            <p className="text-sm text-gray-700">
>>>>>>> 965054e692d1292787da422a24f0eb7af0f7c340
              {paymentMethod === 'credit-card'
                ? 'Credit/Debit Card'
                : paymentMethod === 'razorpay'
                ? 'Razorpay'
                : 'Cash on Delivery'}
            </p>
          </div>

          {/* Order Items */}
<<<<<<< HEAD
          <div className="items-card">
            <h3>Order Items</h3>
            <div className="items-list">
              {cartItems.length === 0 ? (
                <p className="empty-cart-message">Your cart is empty</p>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="item-row">
                    <div className="item-info">
                      <img
                        src={item.image || '/placeholder-product.jpg'}
                        alt={item.name}
                        className="item-image"
                        onError={(e) => {
                          e.target.src = '/placeholder-product.jpg';
                        }}
                      />
                      <div className="item-details">
                        <p className="item-name">{item.name}</p>
                        <div className="quantity-controls">
                          <button 
                            onClick={(e) => handleDecrease(item, e)}
                            disabled={item.quantity <= 1}
                            className="quantity-btn"
                            aria-label="Decrease quantity"
                            data-testid="decrease-quantity"
                          >
                            <FiMinus size={14} />
                          </button>
                          <span 
                            className="quantity-value"
                            aria-label="Current quantity"
                          >
                            {item.quantity || 1}
                          </span>
                          <button 
                            onClick={(e) => handleIncreaseClick(item, e)}
                            disabled={item.quantity >= (item.stock || 99)}
                            className="quantity-btn"
                            aria-label="Increase quantity"
                            data-testid="increase-quantity"
                          >
                            <FiPlus size={14} />
                          </button>
                        </div>
                      </div>
=======
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
>>>>>>> 965054e692d1292787da422a24f0eb7af0f7c340
                    </div>
                    <p className="item-price" aria-label="Item price">
                      {formatCurrency(item.price * (item.quantity || 1))}
                    </p>
                  </div>
<<<<<<< HEAD
                ))
              )}
            </div>
          </div>

          {/* Order Notes */}
          <div className="notes-card">
            <h3>Order Notes</h3>
            <textarea
              placeholder="Any special instructions?"
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              rows={3}
              className="notes-textarea"
              aria-label="Order notes"
              maxLength={500}
            />
            <p className="character-count">
              {orderNotes.length}/500 characters
            </p>
          </div>
        </section>

        {/* Right Panel - Order Summary */}
        <aside className="order-summary">
          <h3>Order Summary</h3>
          <div className="summary-details">
            <div className="summary-row">
=======
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
>>>>>>> 965054e692d1292787da422a24f0eb7af0f7c340
              <span>Subtotal ({itemCount} item{itemCount !== 1 ? 's' : ''})</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{formatCurrency(shipping)}</span>
            </div>
            <div className="summary-row">
              <span>Tax</span>
              <span>{formatCurrency(tax)}</span>
            </div>
<<<<<<< HEAD
            <div className="summary-divider"></div>
            <div className="summary-total">
=======
            <hr className="border-t my-2" />
            <div className="flex justify-between font-bold text-base">
>>>>>>> 965054e692d1292787da422a24f0eb7af0f7c340
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          <button
            onClick={onPlaceOrder}
<<<<<<< HEAD
            disabled={loading || !selectedAddress || cartItems.length === 0}
            className={`place-order-btn ${loading ? 'processing' : ''}`}
            aria-disabled={loading || !selectedAddress || cartItems.length === 0}
            aria-busy={loading}
          >
            {loading ? (
              'Processing...'
            ) : (
              <>
                <FiCheck className="check-icon" />
=======
            disabled={loading}
            className={`w-full py-3 mt-4 rounded-md font-semibold text-white transition duration-300 ${
              loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Processing...' : (
              <span className="flex items-center justify-center gap-2">
                <FiCheck className="text-white" />
>>>>>>> 965054e692d1292787da422a24f0eb7af0f7c340
                Place Order
              </span>
            )}
          </button>

<<<<<<< HEAD
          <p className="terms-notice">
            By placing your order, you agree to VoltX&apos;s Terms of Service and Privacy Policy.
=======
          <p className="text-xs text-center text-gray-500 mt-3">
            By placing your order, you agree to Robojust’s{' '}
            <a href="/terms" className="text-blue-600 underline">Terms</a> &
            <a href="/privacy" className="text-blue-600 underline ml-1">Privacy Policy</a>.
>>>>>>> 965054e692d1292787da422a24f0eb7af0f7c340
          </p>
        </aside>
      </div>
    </section>
  );
};

ReviewStep.propTypes = {
  cartItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      quantity: PropTypes.number,
      image: PropTypes.string,
      stock: PropTypes.number,
    })
  ),
  selectedAddress: PropTypes.shape({
    name: PropTypes.string.isRequired,
    street: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    zip: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    isDefault: PropTypes.bool,
  }),
  paymentMethod: PropTypes.oneOf(['credit-card', 'razorpay', 'cod']).isRequired,
  orderNotes: PropTypes.string,
  setOrderNotes: PropTypes.func.isRequired,
  subtotal: PropTypes.number.isRequired,
  shipping: PropTypes.number.isRequired,
  tax: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  onPlaceOrder: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  onEditAddress: PropTypes.func.isRequired,
  onEditPayment: PropTypes.func.isRequired,
  updateQuantity: PropTypes.func.isRequired,
};

export default ReviewStep;