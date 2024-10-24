import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Policyholder/HomePage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import SubmitClaim from './pages/Policyholder/SubmitClaim';
import TrackClaim from './pages/Policyholder/TrackClaim';  // Import the new TrackClaim component
import ManageClaims from './pages/Admin/ManageClaims';    // Import the new ManageClaims component

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/submit-claim" element={<SubmitClaim />} />
          <Route path="/track-claim" element={<TrackClaim />} />      {/* Route for policyholders to track claims */}
          <Route path="/admin/manage-claims" element={<ManageClaims />} />  {/* Route for admin to manage claims */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
