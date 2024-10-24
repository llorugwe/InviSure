import Header from './components/Header';
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
      <Header />  {/* Add the header here */}
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/submit-claim" element={<SubmitClaim />} />
          <Route path="/track-claim" element={<TrackClaim />} />
          <Route path="/admin/manage-claims" element={<ManageClaims />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
