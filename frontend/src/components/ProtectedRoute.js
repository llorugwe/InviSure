// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Check if the user is authenticated and has the required role
const isAuthenticated = (requiredRole) => {
  const token = localStorage.getItem('accessToken');
  const userRole = localStorage.getItem('role');
  return token && userRole === requiredRole;
};

// ProtectedRoute component to handle authentication and role-based access
const ProtectedRoute = ({ children, role }) => {
  const location = useLocation();

  if (!isAuthenticated(role)) {
    // Store the intended path in localStorage for redirection after login
    localStorage.setItem('redirectPath', location.pathname);
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
