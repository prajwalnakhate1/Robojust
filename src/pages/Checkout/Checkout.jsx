import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loadRazorpay } from '../../components/utils/razorpay';
import { db, auth } from '../../firebase';
import {
  doc,
  collection,
  addDoc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';

import AddressStep from '../AddressStep/AddressStep';
import PaymentStep from '../PaymentStep/PaymentStep';
import ReviewStep from '../ReviewStep/ReviewStep';
import OrderConfirmation from '../OrderConfirmation/OrderConfirmation';

import { FiChevronLeft, FiCheck } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useCart } from '../../context/CartContext';
import './Checkout.css';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong. Please refresh the page.</div>;
    }
    return this.props.children;
  }
}

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, clearCart } = useCart();

  const fromBuyNow = location.state?.fromBuyNow || false;
  const singleProduct = location.state?.product || null;

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [orderNotes, setOrderNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const items = fromBuyNow ? [singleProduct] : cartItems;

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );
  const shipping = 0;
  const tax = subtotal * 0;
  const total = subtotal + shipping + tax;

  const stepLabels = ['Address', 'Payment', 'Review'];
  const stepWidths = ['w-1/3', 'w-2/3', 'w-full'];

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.warning('Please select or add an address first.');
      return;
    }

    setLoading(true);
    try {
      const orderRef = await addDoc(collection(db, 'orders'), {
        userId: auth.currentUser?.uid,
        email: auth.currentUser?.email,
        items,
        address: selectedAddress,
        paymentMethod,
        subtotal,
        shipping,
        tax,
        total,
        status: paymentMethod === 'cod' ? 'confirmed' : 'pending',
        notes: orderNotes,
        createdAt: serverTimestamp(),
      });

      setOrderId(orderRef.id);

      if (paymentMethod === 'cod') {
        toast.success('Order placed with Cash on Delivery');
        if (!fromBuyNow) clearCart();
        setCurrentStep(4);
      } else {
        await processPayment(orderRef.id);
      }
    } catch (error) {
      console.error('Order error:', error);
      toast.error(
        error.code === 'permission-denied'
          ? 'Permission denied. Please check your account.'
          : 'Failed to place order. Try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const processPayment = async (orderId) => {
    if (paymentMethod === 'razorpay') {
      await handleRazorpayPayment(orderId);
    } else {
      toast.error('Payment method not supported');
    }
  };

  const handleRazorpayPayment = async (orderId) => {
    try {
      await loadRazorpay();

      const key = import.meta.env.VITE_RAZORPAY_KEY || 'rzp_test_1234567890';

      const options = {
        key,
        amount: Math.round(total * 100),
        currency: 'INR',
        name: 'VoltX Electronics',
        description: 'Order Payment',
        handler: async (response) => {
          await verifyRazorpayPayment(response, orderId);
          toast.success('Payment successful!');
          if (!fromBuyNow) clearCart();
          setCurrentStep(4);
        },
        prefill: {
          name: selectedAddress?.name || '',
          email: auth.currentUser?.email || '',
          contact: selectedAddress?.phone || '',
        },
        notes: { orderId },
        theme: { color: '#3399cc' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Try again.');
    }
  };

  const verifyRazorpayPayment = async (response, orderId) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        paymentId: response.razorpay_payment_id,
        paymentStatus: 'completed',
        status: 'confirmed',
      });
    } catch (error) {
      console.error('Verification error:', error);
      toast.error(
        error.code === 'permission-denied'
          ? 'Permission denied. Please check your account.'
          : 'Payment verification failed.'
      );
    }
  };

  return (
    <div className="checkout-container">
      {currentStep !== 4 && (
        <nav
          className="checkout-progress"
          aria-label="Checkout progress"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={3}
          aria-valuenow={currentStep}
        >
          <div className="checkout-bar">
            <div className={`checkout-bar-fill ${stepWidths[currentStep - 1]}`}></div>
          </div>

          {stepLabels.map((label, i) => {
            const isComplete = currentStep > i + 1;
            const isCurrent = currentStep === i + 1;
            return (
              <div
                key={label}
                className={`checkout-step ${isComplete ? 'active' : ''}`}
                aria-current={isCurrent ? 'step' : undefined}
                aria-disabled={!isComplete && !isCurrent}
              >
                <div
                  className={`checkout-step-circle ${
                    isComplete ? 'complete' : isCurrent ? 'current' : ''
                  }`}
                >
                  {isComplete ? <FiCheck aria-hidden="true" /> : i + 1}
                </div>
                <div className="checkout-step-label">{label}</div>
              </div>
            );
          })}
        </nav>
      )}

      {currentStep === 1 && (
        <ErrorBoundary>
          <AddressStep
            onSelectAddress={setSelectedAddress}
            onNext={() => setCurrentStep(2)}
          />
        </ErrorBoundary>
      )}

      {currentStep === 2 && (
        <>
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className="checkout-back"
            aria-label="Go back to Address step"
          >
            <FiChevronLeft className="mr-1" /> Back to Address
          </button>
          <PaymentStep
            onNext={() => setCurrentStep(3)}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />
        </>
      )}

      {currentStep === 3 && (
        <>
          <button
            type="button"
            onClick={() => setCurrentStep(2)}
            className="checkout-back"
            aria-label="Go back to Payment step"
          >
            <FiChevronLeft className="mr-1" /> Back to Payment
          </button>
          <ReviewStep
            cartItems={items}
            selectedAddress={selectedAddress}
            paymentMethod={paymentMethod}
            orderNotes={orderNotes}
            setOrderNotes={setOrderNotes}
            subtotal={subtotal}
            shipping={shipping}
            tax={tax}
            total={total}
            onPlaceOrder={handlePlaceOrder}
            loading={loading}
            onEditAddress={() => setCurrentStep(1)}
            onEditPayment={() => setCurrentStep(2)}
          />
        </>
      )}

      {currentStep === 4 && (
        <OrderConfirmation
          orderId={orderId}
          total={total}
          paymentMethod={paymentMethod}
        />
      )}
    </div>
  );
};

export default Checkout;