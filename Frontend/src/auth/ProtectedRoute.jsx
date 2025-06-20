// src/auth/ProtectRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

export const ProtectedRoute = ({ allowedUserTypes, children }) => {
  const { auth, getDashboardRoute } = useAuth();
  const location = useLocation();

  if (!auth) {
    // Redirect to login if not authenticated
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Check if user type matches allowed types
  if (!allowedUserTypes.includes(auth.user.userType)) {
    // Redirect to appropriate dashboard using the getDashboardRoute function
    return <Navigate to={getDashboardRoute()} replace />;
  }

  return children;
};

export default ProtectedRoute;