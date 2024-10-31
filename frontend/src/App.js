import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/Policyholder/HomePage';
import Dashboard from './pages/Policyholder/Dashboard'; // Add Dashboard if not already imported
import AdminDashboard from './pages/Admin/AdminDashboard';
import SubmitClaim from './pages/Policyholder/SubmitClaim';
import TrackClaim from './pages/Policyholder/TrackClaim';
import ManageClaims from './pages/Admin/ManageClaims';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';

// Check if user is authenticated
const isAuthenticated = () => {
  return !!localStorage.getItem('accessToken');
};

// Protected route component
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
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/submit-claim"
            element={
              <ProtectedRoute>
                <SubmitClaim />
              </ProtectedRoute>
            }
          />
          <Route
            path="/track-claim"
            element={
              <ProtectedRoute>
                <TrackClaim />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/manage-claims"
            element={
              <ProtectedRoute>
                <ManageClaims />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
