// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Policyholder/Dashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';
import SubmitClaim from './pages/Policyholder/SubmitClaim';
import TrackClaim from './pages/Policyholder/TrackClaim';
import ManageClaims from './pages/Admin/ManageClaims';
import ManagePolicies from './pages/Admin/ManagePolicies'; // Import ManagePolicies
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';

const isAuthenticated = () => {
  return !!localStorage.getItem('accessToken');
};

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Header />
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/submit-claim" element={<ProtectedRoute><SubmitClaim /></ProtectedRoute>} />
          <Route path="/track-claim" element={<ProtectedRoute><TrackClaim /></ProtectedRoute>} />
          <Route path="/admin/manage-claims" element={<ProtectedRoute><ManageClaims /></ProtectedRoute>} />
          <Route path="/admin/manage-policies" element={<ProtectedRoute><ManagePolicies /></ProtectedRoute>} /> {/* Add this route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
