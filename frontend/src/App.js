import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Policyholder/HomePage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import SubmitClaim from './pages/Policyholder/SubmitClaim';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/submit-claim" element={<SubmitClaim />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
