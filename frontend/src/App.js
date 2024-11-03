// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Policyholder/Dashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';
import SubmitClaim from './pages/Policyholder/SubmitClaim';
import TrackClaim from './pages/Policyholder/TrackClaim';
import ManageClaims from './pages/Admin/ManageClaims';
import ManagePolicies from './pages/Admin/ManagePolicies';
import PlanDetails from './pages/Policyholder/PlanDetails'; // Import PlanDetails component
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';

function App() {
  return (
    <Router>
      <Header />
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Plan Details Page for Viewing and Purchasing */}
          <Route path="/plan/:planId" element={<PlanDetails />} /> {/* New route for plan details */}

          {/* Protected Routes for Policyholder */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="policyholder">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/submit-claim"
            element={
              <ProtectedRoute role="policyholder">
                <SubmitClaim />
              </ProtectedRoute>
            }
          />
          <Route
            path="/track-claim"
            element={
              <ProtectedRoute role="policyholder">
                <TrackClaim />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes for Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/manage-claims"
            element={
              <ProtectedRoute role="admin">
                <ManageClaims />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/manage-policies"
            element={
              <ProtectedRoute role="admin">
                <ManagePolicies />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
