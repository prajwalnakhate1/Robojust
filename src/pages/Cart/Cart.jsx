import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    formatPrice,
    calculateTotals 
  } = useCart();

  const totals = calculateTotals();

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <h2 className="cart-empty-title">Your Cart is Empty</h2>
        <Link to="/products" className="cart-empty-link">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2 className="cart-title">Your Shopping Cart</h2>
      <div className="cart-header">
        <span>Product</span>
        <span>Price</span>
        <span>Quantity</span>
        <span>Total</span>
      </div>

      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-product">
              <img
                src={item.image || '/placeholder-product.jpg'}
                alt={item.name}
                className="cart-item-image"
                onError={(e) => {
                  e.target.src = '/placeholder-product.jpg';
                }}
              />
              <div className="cart-item-details">
                <h3 className="cart-item-name">{item.name}</h3>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="cart-remove-btn-mobile"
                >
                  Remove
                </button>
              </div>
            </div>

            <div className="cart-item-price">{formatPrice(item.price)}</div>

            <div className="cart-item-quantity">
              <button 
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                −
              </button>
              <span>{item.quantity}</span>
              <button 
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                disabled={item.quantity >= (item.stock || 99)}
              >
                +
              </button>
            </div>

            <div className="cart-item-total">{formatPrice(item.price * item.quantity)}</div>
            
            <button
              onClick={() => removeFromCart(item.id)}
              className="cart-remove-btn"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="cart-summary-details">
          <div className="summary-row total">
            <span>Order Total ({totals.count} items)</span>
            <span>{formatPrice(totals.raw.subtotal)}</span>
          </div>
        </div>

        <div className="cart-actions">
          <Link to="/products" className="continue-shopping">
            Continue Shopping
          </Link>
          <button onClick={clearCart} className="clear-cart">
            Clear Cart
          </button>
          <button
            onClick={() => navigate('/checkout')}
            className="checkout-btn"
            disabled={cartItems.length === 0}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;