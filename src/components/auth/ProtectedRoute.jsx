import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // ⏳ Still checking auth
  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  // 🔒 Not logged in
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 🔐 Admin route but user is not admin
  if (
    location.pathname.startsWith('/admin') &&
    !user.isAdmin
  ) {
    return <Navigate to="/" replace />;
  }

  // ✅ All good
  return children;
};

export default ProtectedRoute;
