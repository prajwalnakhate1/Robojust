import React, { useState, useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { toast } from 'react-toastify';
import './Products.css';

const Products = ({ products }) => {
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const { user } = useAuth();
  const { addToWishlist, wishlistItems, removeFromWishlist } = useWishlist();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const isInCart = (id) => cartItems.some((item) => item.id === id);
  const isInWishlist = (id) => wishlistItems.some((item) => item.id === id);

  const handleAddToCart = (product) => {
    if (!user) {
      toast.warning('⚠️ Please login to add items to your cart.');
      return navigate('/login');
    }

    if (isInCart(product.id)) {
      toast.info('ℹ️ Item is already in your cart.');
    } else {
      addToCart(product);
      toast.success(`✅ ${product.name} added to cart!`);
    }
  };

  const handleWishlistAction = (product) => {
    if (!user) {
      toast.warning('⚠️ Please login to manage your wishlist.');
      return navigate('/login');
    }

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.info(`❤️ ${product.name} removed from wishlist!`);
    } else {
      addToWishlist(product);
      toast.success(`❤️ ${product.name} added to wishlist!`);
    }
  };

  const handleBuyNow = (product) => {
    if (!user) {
      toast.warning('⚠️ Please login to buy items.');
      return navigate('/login', { state: { from: '/checkout' } });
    }

    navigate('/checkout', {
      state: {
        fromBuyNow: true,
        product: { ...product, quantity: 1 },
      },
    });
  };

  if (loading) {
    return (
      <div className="products-container loading">
        <div className="loader" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="products-container" role="region" aria-label="Product listing">
      <section className="products-section">
        <div className="products-grid">
          {products.length === 0 ? (
            <p className="no-products-text" role="alert">
              No products found.
            </p>
          ) : (
            products.map((product) => (
              <article
                key={product.id}
                className="product-card"
                aria-labelledby={`product-${product.id}-title`}
              >
                <button
                  onClick={() => handleWishlistAction(product)}
                  className={`wishlist-btn ${
                    isInWishlist(product.id)
                      ? 'wishlist-active'
                      : 'wishlist-inactive'
                  }`}
                  aria-label={
                    isInWishlist(product.id)
                      ? `Remove ${product.name} from wishlist`
                      : `Add ${product.name} to wishlist`
                  }
                  title={
                    isInWishlist(product.id)
                      ? 'Remove from wishlist'
                      : 'Add to wishlist'
                  }
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                  </svg>
                </button>

                <div className="product-image-container">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = '/placeholder-image.jpg';
                    }}
                  />
                </div>

                <div className="product-info">
                  <span className="product-category">{product.category}</span>
                  <h3 id={`product-${product.id}-title`} className="product-name">
                    {product.name}
                  </h3>
                  <p className="product-price">
                    ₹{product.price.toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p className="product-sku">SKU: {product.sku || 'N/A'}</p>
                  <p className="product-stock">
                    {product.stock > 0 ? 'Available in Stock' : 'Out of Stock'}
                  </p>

                  <div className="product-buttons">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="add-to-cart-btn"
                      disabled={product.stock === 0}
                      aria-label={`Add ${product.name} to cart`}
                    >
                      🛒 Add to Cart
                    </button>
                    <button
                      onClick={() => handleBuyNow(product)}
                      className="buy-now-btn"
                      disabled={product.stock === 0}
                      aria-label={`Buy ${product.name} now`}
                    >
                      ⚡ Buy Now
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default memo(Products);
