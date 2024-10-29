import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTotalPolicies, getPendingClaims, getTotalClaims } from '../../services/claimsService';

const AdminDashboard = () => {
  const [totalPolicies, setTotalPolicies] = useState(0);
  const [pendingClaims, setPendingClaims] = useState(0);
  const [totalClaims, setTotalClaims] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch key metrics when the component mounts
    const fetchMetrics = async () => {
      try {
        const policiesResponse = await getTotalPolicies(); // Fetch total policies
        const pendingClaimsResponse = await getPendingClaims(); // Fetch pending claims
        const totalClaimsResponse = await getTotalClaims(); // Fetch total claims

        setTotalPolicies(policiesResponse.total || 0);
        setPendingClaims(pendingClaimsResponse.pending || 0);
        setTotalClaims(totalClaimsResponse.total || 0);
      } catch (err) {
        setError('Failed to load metrics. Please try again.');
        console.error('Error fetching admin metrics:', err);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <div className="container mt-5">
      <h1>Admin Dashboard</h1>
      <p>Manage insurance policies and claims here.</p>

      {error && <p className="alert alert-danger">{error}</p>}

      <div className="mt-4">
        <h3>Key Metrics</h3>
        <ul>
          <li><strong>Total Policies:</strong> {totalPolicies}</li>
          <li><strong>Pending Claims:</strong> {pendingClaims}</li>
          <li><strong>Total Claims:</strong> {totalClaims}</li>
        </ul>
      </div>

      <div className="mt-4">
        <h3>Actions</h3>
        <ul>
          <li>
            <Link to="/admin/manage-claims">Manage Claims</Link> {/* Link to claims management */}
          </li>
          <li>
            <Link to="/admin/manage-policies">Manage Policies</Link> {/* Link to policies management */}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
