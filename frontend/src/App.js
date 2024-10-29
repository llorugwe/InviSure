import Header from './components/Header'; 
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Policyholder/HomePage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import SubmitClaim from './pages/Policyholder/SubmitClaim';
import TrackClaim from './pages/Policyholder/TrackClaim';
import ManageClaims from './pages/Admin/ManageClaims';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';

function App() {
  return (
    <Router>
      <Header />  {/* Header for navigation */}
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/submit-claim" element={<SubmitClaim />} />
          <Route path="/track-claim" element={<TrackClaim />} />
          <Route path="/admin/manage-claims" element={<ManageClaims />} />
          <Route path="/login" element={<Login />} />            {/* Route for Login */}
          <Route path="/register" element={<Register />} />      {/* Route for Register */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
