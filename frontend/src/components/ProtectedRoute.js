// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

// Check if user is authenticated and has the required role
const isAuthenticated = (requiredRole) => {
  const token = localStorage.getItem('accessToken');
  const userRole = localStorage.getItem('role');
  return token && userRole === requiredRole;
};

// ProtectedRoute component to handle authentication and role-based access
const ProtectedRoute = ({ children, role }) => {
  return isAuthenticated(role) ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
