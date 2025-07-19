import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { collection, query, where, orderBy, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import './OrderPage.css';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center mt-20">
          <p className="text-red-500">Something went wrong. Please refresh the page.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const OrderPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOption, setSortOption] = useState('createdAt-desc');

  useEffect(() => {
    if (!user) {
      toast.info('Please login to view your orders');
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const ordersRef = collection(db, 'orders');
        let q = query(ordersRef, where('userId', '==', user.uid));

        // Apply sorting
        const [sortField, sortDirection] = sortOption.split('-');
        q = query(q, orderBy(sortField, sortDirection));

        const snapshot = await getDocs(q);
        const fetchedOrders = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setOrders(fetchedOrders);
        setFilteredOrders(fetchedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error(
          error.code === 'failed-precondition'
            ? 'Firestore index required. Check Firestore Console.'
            : 'Failed to load orders. Try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate, sortOption]);

  // Filter orders based on status
  useEffect(() => {
    if (statusFilter === 'All') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter((order) => order.status === statusFilter.toLowerCase()));
    }
  }, [statusFilter, orders]);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: 'cancelled',
        updatedAt: serverTimestamp(),
      });
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: 'cancelled' } : order
        )
      );
      toast.success('Order cancelled successfully');
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error(
        error.code === 'permission-denied'
          ? 'Permission denied. Please check your account.'
          : 'Failed to cancel order.'
      );
    }
  };

  const handleViewDetails = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'cancelled':
        return 'text-red-500';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <svg
          className="animate-spin h-8 w-8 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
        <p className="ml-2 text-lg font-medium text-gray-600">Loading your orders...</p>
      </div>
    );
  }

  if (!filteredOrders.length && !loading) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-bold mb-2">No Orders Found</h2>
        <p className="text-gray-500">
          {statusFilter === 'All'
            ? "You haven't placed any orders yet."
            : `No orders found with status: ${statusFilter}.`}
        </p>
        <button
          onClick={() => navigate('/products')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Shop Now
        </button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>

        {/* Filter and Sort Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700">
              Filter by Status
            </label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex-1">
            <label htmlFor="sortOption" className="block text-sm font-medium text-gray-700">
              Sort by
            </label>
            <select
              id="sortOption"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="createdAt-desc">Date: Newest First</option>
              <option value="createdAt-asc">Date: Oldest First</option>
              <option value="total-desc">Total: High to Low</option>
              <option value="total-asc">Total: Low to High</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="order-card border rounded-lg p-4 shadow-sm bg-white animate-fadeIn"
            >
              <div className="mb-2">
                <span className="font-medium">Order ID:</span> {order.id}
              </div>
              <div className="mb-2">
                <span className="font-medium">Order Date:</span>{' '}
                {order.createdAt?.seconds
                  ? new Date(order.createdAt.seconds * 1000).toLocaleString()
                  : 'N/A'}
              </div>
              <div className="mb-2">
                <span className="font-medium">Payment:</span> {order.paymentMethod || 'N/A'}
              </div>
              <div className="mb-2">
                <span className="font-medium">Status:</span>{' '}
                <span className={`font-semibold ${getStatusStyles(order.status)}`}>
                  {order.status || 'Pending'}
                </span>
              </div>
              <div className="mb-2">
                <span className="font-medium">Total:</span> ₹{(order.total || 0).toFixed(2)}
              </div>
              <div className="mb-3">
                <h3 className="font-semibold">Shipping Address:</h3>
                <p className="text-sm">
                  {order.address
                    ? `${order.address.name}, ${order.address.address}, ${order.address.city}, ${order.address.state} - ${order.address.pincode}`
                    : 'N/A'}
                </p>
              </div>
              <div className="mb-3">
                <h3 className="font-semibold">Items:</h3>
                <ul className="list-disc pl-5 text-sm">
                  {order.items?.length ? (
                    order.items.map((item, i) => (
                      <li key={i}>
                        {item.name || 'Unknown Item'} × {item.quantity || 1} – ₹
                        {((item.quantity || 1) * (item.price || 0)).toFixed(2)}
                      </li>
                    ))
                  ) : (
                    <li>No items found</li>
                  )}
                </ul>
              </div>
              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => handleViewDetails(order.id)}
                  className="text-blue-600 hover:underline text-sm"
                  aria-label={`View details for order ${order.id}`}
                >
                  View Details
                </button>
                {order.status !== 'cancelled' && order.status !== 'delivered' && (
                  <button
                    onClick={() => handleCancelOrder(order.id)}
                    className="text-red-600 hover:underline text-sm"
                    aria-label={`Cancel order ${order.id}`}
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default OrderPage;