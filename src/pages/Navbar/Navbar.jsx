import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { toast } from 'react-toastify';
import logo from '../../assets/images/logo.png';
import './Navbar.css';

const Navbar = () => {
  const { user } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error(error);
      toast.error('Failed to logout');
    } finally {
      setProfileOpen(false);
    }
  };

  const handleOutsideClick = (e) => {
    if (profileRef.current && !profileRef.current.contains(e.target)) {
      setProfileOpen(false);
    }
    if (searchRef.current && !searchRef.current.contains(e.target)) {
      setSearchFocused(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setSearchFocused(false);
    }
  };

  const handleSearchFocus = () => {
    setSearchFocused(true);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="logo-container">
          <img
            src={logo}
            alt="VoltX Logo"
            className="logo-img"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/120x48?text=VoltX';
            }}
          />
          <span className="logo-text"></span>
        </Link>

        <div className="desktop-menu">
          <div className="nav-links">
            <Link
              to="/"
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              aria-current={location.pathname === '/' ? 'page' : undefined}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
              aria-current={location.pathname === '/about' ? 'page' : undefined}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}
              aria-current={location.pathname === '/contact' ? 'page' : undefined}
            >
              Contact
            </Link>
          </div>

          <div ref={searchRef} className={`search-container ${searchFocused ? 'focused' : ''}`}>
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleSearchFocus}
                className="search-input"
                aria-label="Search products"
              />
              <button
                type="submit"
                className="search-button"
                aria-label="Submit search"
              >
                <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>

          <div className="action-icons">
            <Link 
              to="/wishlist" 
              className="icon-button"
              aria-label="Wishlist"
            >
              <svg
                className="wishlist-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              {cartItems.length > 0 && (
                <span className="cart-badge" aria-hidden="true">
                  {cartItems.length}
                </span>
              )}
            </Link>

            <Link 
              to="/cart" 
              className="icon-button"
              aria-label="Shopping cart"
            >
              <svg
                className="cart-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4z"
                />
              </svg>
              {cartItems.length > 0 && (
                <span className="cart-badge" aria-hidden="true">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {user ? (
              <div ref={profileRef} className="profile-container">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="profile-button"
                  aria-label="User profile"
                  aria-expanded={profileOpen}
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="User profile"
                      className="profile-image"
                    />
                  ) : (
                    <div className="profile-initials">
                      {user.displayName ? user.displayName.charAt(0) : user.email.charAt(0)}
                    </div>
                  )}
                </button>

                {profileOpen && (
                  <div className="profile-dropdown">
                    <Link
                      to="/profile"
                      className="dropdown-item"
                      onClick={() => setProfileOpen(false)}
                    >
                      <svg className="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      My Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="dropdown-item"
                      onClick={() => setProfileOpen(false)}
                    >
                      <svg className="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="dropdown-item"
                    >
                      <svg className="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="login-button"
                aria-label="Login"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        <div className="mobile-menu-button">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="menu-toggle-button"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg className="menu-close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="menu-open-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">
            <Link
              to="/"
              className={`mobile-menu-item ${location.pathname === '/' ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
              aria-current={location.pathname === '/' ? 'page' : undefined}
            >
              <svg className="mobile-menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </Link>
            <Link
              to="/about"
              className={`mobile-menu-item ${location.pathname === '/about' ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
              aria-current={location.pathname === '/about' ? 'page' : undefined}
            >
              <svg className="mobile-menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              About
            </Link>
            <Link
              to="/contact"
              className={`mobile-menu-item ${location.pathname === '/contact' ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
              aria-current={location.pathname === '/contact' ? 'page' : undefined}
            >
              <svg className="mobile-menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact
            </Link>
            <Link
              to="/wishlist"
              className="mobile-menu-item"
              onClick={() => setMenuOpen(false)}
            >
              <svg className="mobile-menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Wishlist
            </Link>
            <Link
              to="/cart"
              className="mobile-menu-item"
              onClick={() => setMenuOpen(false)}
            >
              <svg className="mobile-menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              Cart ({cartItems.length})
            </Link>

            <div className="mobile-menu-divider">
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="mobile-menu-item"
                    onClick={() => setMenuOpen(false)}
                  >
                    <svg className="mobile-menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    My Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="mobile-menu-item"
                    onClick={() => setMenuOpen(false)}
                  >
                    <svg className="mobile-menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    My Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="mobile-menu-item"
                  >
                    <svg className="mobile-menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="mobile-menu-item login-button-mobile"
                  onClick={() => setMenuOpen(false)}
                >
                  <svg className="mobile-menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;