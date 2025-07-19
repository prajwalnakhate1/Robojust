import React, { useState } from 'react';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import './Wishlist.css';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, loading } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [animatingHearts, setAnimatingHearts] = useState({});

  const handleRemoveItem = (productId) => {
    // Trigger animation before removal
    setAnimatingHearts(prev => ({ ...prev, [productId]: true }));
    
    setTimeout(() => {
      removeFromWishlist(productId);
      toast.success('Item removed from wishlist');
      setAnimatingHearts(prev => ({ ...prev, [productId]: false }));
    }, 800); // Match this with your CSS animation duration
  };

  if (!user) {
    return (
      <div className="wishlist-container">
        <div className="wishlist-empty-state">
          <h2>Wishlist is Empty</h2>
          <p>You need to be logged in to view your wishlist.</p>
          <div className="wishlist-auth-buttons">
            <button onClick={() => navigate('/login')} className="wishlist-empty-state-btn">
              Login
            </button>
            <button onClick={() => navigate('/register')} className="wishlist-empty-state-btn">
              Create Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="wishlist-container">
        <div className="wishlist-loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="wishlist-container">
      <div className="wishlist-header">
        <h1>Your Wishlist</h1>
        <p>
          {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
        </p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="wishlist-empty-state">
          <div className="wishlist-empty-icon-container">
            <FaHeart className="wishlist-empty-icon" />
          </div>
          <h3>No items in wishlist</h3>
          <p>Start adding items to your wishlist to see them here.</p>
          <Link to="/products" className="wishlist-empty-state-link">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="wishlist-card">
          <ul>
            {wishlistItems.map((item) => (
              <li key={item.id} className="wishlist-card-item">
                <button
                  className={`wishlist-heart-btn ${animatingHearts[item.id] ? 'animating' : ''}`}
                  onClick={() => handleRemoveItem(item.id)}
                  aria-label="Remove from wishlist"
                >
                  <FaHeart className="wishlist-heart-icon" />
                </button>
                <img
                  className="wishlist-img"
                  src={item.image || 'https://via.placeholder.com/96?text=Product'}
                  alt={item.name}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/96?text=Product';
                  }}
                />
                <div className="wishlist-info">
                  <div className="wishlist-top">
                    <h4>
                      <Link to={`/products/${item.id}`} className="wishlist-name-link">
                        {item.name}
                      </Link>
                    </h4>
                    <p className="wishlist-price">${item.price?.toFixed(2) || '0.00'}</p>
                  </div>
                  <div className="wishlist-bottom">
                    <p className="wishlist-category">{item.category || 'General'}</p>
                    <div className="wishlist-actions">
                      <button 
                        onClick={() => handleRemoveItem(item.id)}
                        className="wishlist-remove-btn"
                      >
                        Remove
                      </button>
                      <Link 
                        to={`/products/${item.id}`} 
                        className="wishlist-view-btn"
                      >
                        View Product
                      </Link>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Wishlist;