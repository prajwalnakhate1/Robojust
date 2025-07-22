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

  const handleSearchFocus = () => setSearchFocused(true);

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          {/* ✅ Logo */}
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
          </Link>

          {/* ✅ Desktop Search Bar */}
          <div className="hidden md:block">
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
                <button type="submit" className="search-button" aria-label="Submit search">
                  <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>
            </div>
          </div>

          {/* ✅ Desktop Menu */}
          <div className="desktop-menu">
            <div className="nav-links">
              <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
              <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>About</Link>
              <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>Contact</Link>
            </div>

            <div className="action-icons">
              <Link to="/wishlist" className="icon-button" aria-label="Wishlist">
                <svg className="wishlist-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {cartItems.length > 0 && <span className="cart-badge">{cartItems.length}</span>}
              </Link>

              <Link to="/cart" className="icon-button" aria-label="Cart">
                <svg className="cart-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
                {cartItems.length > 0 && <span className="cart-badge">{cartItems.length}</span>}
              </Link>

              {user ? (
                <div ref={profileRef} className="profile-container">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="profile-button"
                    aria-label="User Profile"
                  >
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="User" className="profile-image" />
                    ) : (
                      <div className="profile-initials">
                        {user.displayName ? user.displayName.charAt(0) : user.email.charAt(0)}
                      </div>
                    )}
                  </button>

                  {profileOpen && (
                    <div className="profile-dropdown">
                      <Link to="/profile" className="dropdown-item" onClick={() => setProfileOpen(false)}>My Profile</Link>
                      <Link to="/orders" className="dropdown-item" onClick={() => setProfileOpen(false)}>My Orders</Link>
                      <button className="dropdown-item" onClick={handleLogout}>Logout</button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="login-button">Login</Link>
              )}
            </div>
          </div>

          {/* ✅ Mobile Menu Toggle */}
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
      </nav>

      {/* ✅ Mobile Search Bar (Below Navbar) */}
      <div className="block md:hidden px-4 mt-2">
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
            <button type="submit" className="search-button" aria-label="Submit search">
              <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      {/* ✅ Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">
            <Link to="/" className={`mobile-menu-item ${location.pathname === '/' ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/about" className={`mobile-menu-item ${location.pathname === '/about' ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>About</Link>
            <Link to="/contact" className={`mobile-menu-item ${location.pathname === '/contact' ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Contact</Link>
            <Link to="/wishlist" className="mobile-menu-item" onClick={() => setMenuOpen(false)}>Wishlist</Link>
            <Link to="/cart" className="mobile-menu-item" onClick={() => setMenuOpen(false)}>Cart ({cartItems.length})</Link>

            <div className="mobile-menu-divider">
              {user ? (
                <>
                  <Link to="/profile" className="mobile-menu-item" onClick={() => setMenuOpen(false)}>My Profile</Link>
                  <Link to="/orders" className="mobile-menu-item" onClick={() => setMenuOpen(false)}>My Orders</Link>
                  <button onClick={handleLogout} className="mobile-menu-item">Logout</button>
                </>
              ) : (
                <Link to="/login" className="mobile-menu-item" onClick={() => setMenuOpen(false)}>Login</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
