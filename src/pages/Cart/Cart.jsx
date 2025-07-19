import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cartItems.length === 0)
    return (
      <div className="cart-empty">
        <h2 className="cart-empty-title">Your Cart is Empty</h2>
        <Link to="/products" className="cart-empty-link">
          Continue Shopping
        </Link>
      </div>
    );

  return (
    <div className="cart-container">
      <h2 className="cart-title">Shopping Cart</h2>

      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-info">
              <img
                src={item.image}
                alt={item.name}
                className="cart-item-image"
              />
              <div>
                <h3 className="cart-item-name">{item.name}</h3>
                <p className="cart-item-price">${item.price.toFixed(2)}</p>
              </div>
            </div>

            <div className="cart-item-actions">
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  updateQuantity(item.id, parseInt(e.target.value))
                }
                className="cart-qty-input"
              />
              <button
                onClick={() => removeFromCart(item.id)}
                className="cart-remove-btn"
              >
                Remove
              </button>
            </div>

            <div className="cart-item-total">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <div className="cart-footer">
        <div className="cart-total">Total: ${totalAmount.toFixed(2)}</div>

        <div className="cart-footer-buttons">
          <button onClick={clearCart} className="cart-clear-btn">
            Clear Cart
          </button>
          <button
            onClick={() => navigate('/checkout')}
            className="cart-checkout-btn"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
