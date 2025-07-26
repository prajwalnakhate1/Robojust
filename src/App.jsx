import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SpeedInsights } from "@vercel/speed-insights/react";

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Core Components
import Navbar from './pages/Navbar/Navbar';
import FooterSection from './pages/Footer/Footer';
import LoadingSpinner from './components/ui/LoadingSpinner';
import ScrollToTop from './components/utils/ScrollToTop';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Lazy-loaded Pages with explicit error handling
const Home = lazy(() => import('./pages/Home/Home'));
const About = lazy(() => import('./pages/About/About'));
const Products = lazy(() => import('./pages/Products/Products'));
const ProductDetails = lazy(() => import('./pages/ProductDetails/ProductDetails'));
const SearchResults = lazy(() => import('./pages/SearchResults/SearchResults'));
const Contact = lazy(() => import('./pages/Contact/Contact'));
const Login = lazy(() => import('./pages/Login/Login'));
const Register = lazy(() => import('./pages/Register/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword/ForgotPassword'));
const Cart = lazy(() => import('./pages/Cart/Cart'));
const Checkout = lazy(() => import('./pages/Checkout/Checkout'));
const Profile = lazy(() => import('./pages/Profile/Profile'));
const Wishlist = lazy(() => import('./pages/Wishlist/Wishlist'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation/OrderConfirmation'));
const OrderPage = lazy(() => import('./pages/OrderPage/OrderPage'));
const Gallery = lazy(() => import('./pages/Gallery/Gallery'));
const NotFound = lazy(() => import('./pages/NotFound/NotFound'));
const AddressStep = lazy(() => import('./pages/AddressStep/AddressStep'));

// Legal Pages with enhanced error handling and preloading
const PrivacyPolicy = lazy(() => 
  import('./pages/LegalPages/PrivacyPolicy/PrivacyPolicy')
    .then(module => ({ default: module.default }))
    .catch(() => ({ default: () => <div>Error loading Privacy Policy</div> }))
);

const TermsOfService = lazy(() => 
  import('./pages/LegalPages/TermsOfService/TermsOfService')
    .then(module => ({ default: module.default }))
    .catch(() => ({ default: () => <div>Error loading Terms of Service</div> }))
);

const CookiePolicy = lazy(() => 
  import('./pages/LegalPages/CookiePolicy/CookiePolicy')
    .then(module => ({ default: module.default }))
    .catch(() => ({ default: () => <div>Error loading Cookie Policy</div> }))
);

// Error Boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Something went wrong.</div>;
    }
    return this.props.children;
  }
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            <ScrollToTop />
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <Suspense fallback={<LoadingSpinner fullScreen />}>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:productId" element={<ProductDetails />} />
                    <Route path="/search" element={<SearchResults />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
                    <Route path="/gallery" element={<Gallery />} />
                    
                    {/* Legal Pages with Error Boundaries */}
                    <Route 
                      path="/privacy" 
                      element={
                        <ErrorBoundary fallback={<div>Error loading Privacy Policy</div>}>
                          <PrivacyPolicy />
                        </ErrorBoundary>
                      } 
                    />
                    <Route 
                      path="/terms" 
                      element={
                        <ErrorBoundary fallback={<div>Error loading Terms of Service</div>}>
                          <TermsOfService />
                        </ErrorBoundary>
                      } 
                    />
                    <Route 
                      path="/cookies" 
                      element={
                        <ErrorBoundary fallback={<div>Error loading Cookie Policy</div>}>
                          <CookiePolicy />
                        </ErrorBoundary>
                      } 
                    />

                    {/* Protected Routes */}
                    <Route
                      path="/cart"
                      element={
                        <ProtectedRoute>
                          <Cart />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/checkout"
                      element={
                        <ProtectedRoute>
                          <Checkout />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/wishlist"
                      element={
                        <ProtectedRoute>
                          <Wishlist />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/orders"
                      element={
                        <ProtectedRoute>
                          <OrderPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/address"
                      element={
                        <ProtectedRoute>
                          <AddressStep />
                        </ProtectedRoute>
                      }
                    />

                    {/* Fallback Route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </main>
              <FooterSection />
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
              />
              <SpeedInsights />
            </div>
          </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;