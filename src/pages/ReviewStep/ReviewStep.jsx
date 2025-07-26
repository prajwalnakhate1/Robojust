import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { FiCheck, FiEdit2, FiPlus, FiMinus } from 'react-icons/fi';
import './ReviewStep.css';

const ReviewStep = ({
  cartItems = [],
  selectedAddress,
  paymentMethod,
  orderNotes = '',
  setOrderNotes,
  subtotal,
  shipping,
  tax,
  total,
  onPlaceOrder,
  loading = false,
  onEditAddress,
  onEditPayment,
  updateQuantity,
}) => {
  const itemCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

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
              <button
                type="button"
                onClick={onEditAddress}
                className="edit-button"
                aria-label="Change shipping address"
              >
                <FiEdit2 className="edit-icon" />
                Change
              </button>
            </div>
            {selectedAddress ? (
              <address className="address-content">
                <p>{selectedAddress.name}</p>
                <p>{selectedAddress.street}</p>
                <p>
                  {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zip}
                </p>
                <p>Phone: {selectedAddress.phone}</p>
                {selectedAddress.isDefault && (
                  <span className="default-badge">
                    Default
                  </span>
                )}
              </address>
            ) : (
              <p className="no-address">No address selected.</p>
            )}
          </div>

          {/* Payment Method */}
          <div className="payment-card">
            <div className="payment-header">
              <h3>Payment Method</h3>
              <button
                type="button"
                onClick={onEditPayment}
                className="edit-button"
                aria-label="Change payment method"
              >
                <FiEdit2 className="edit-icon" />
                Change
              </button>
            </div>
            <p className="payment-method">
              {paymentMethod === 'credit-card'
                ? 'Credit/Debit Card'
                : paymentMethod === 'razorpay'
                ? 'Razorpay'
                : 'Cash on Delivery'}
            </p>
          </div>

          {/* Order Items */}
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
                    </div>
                    <p className="item-price" aria-label="Item price">
                      {formatCurrency(item.price * (item.quantity || 1))}
                    </p>
                  </div>
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
            <div className="summary-divider"></div>
            <div className="summary-total">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onPlaceOrder}
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
                Place Order
              </>
            )}
          </button>

          <p className="terms-notice">
            By placing your order, you agree to VoltX&apos;s Terms of Service and Privacy Policy.
          </p>
        </aside>
      </div>
    </div>
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