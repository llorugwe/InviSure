import React, { useEffect, useState } from 'react';
import { getClaims, getTotalPolicies, getPendingClaims } from '../../services/claimsService';

const Dashboard = () => {
  const [policyDetails, setPolicyDetails] = useState([]);
  const [premiumInfo, setPremiumInfo] = useState(null);
  const [claimHistory, setClaimHistory] = useState([]);
  const [error, setError] = useState(null);

  // Check the user's role
  const userRole = localStorage.getItem('role');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const claimsData = await getClaims();
        setClaimHistory(claimsData);

        // Admin-specific data fetch
        if (userRole === 'admin') {
          const policiesData = await getTotalPolicies();
          const pendingClaimsData = await getPendingClaims();

          setPolicyDetails(policiesData);
          setPremiumInfo(pendingClaimsData);
        }
      } catch (error) {
        setError('Failed to load dashboard data.');
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();

    // Refresh dashboard data every 30 seconds
    const intervalId = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(intervalId);
  }, [userRole]);

  return (
    <div className="container mt-5">
      <h2>{userRole === 'admin' ? 'Admin Dashboard' : 'User Dashboard'}</h2>
      {error && <p className="alert alert-danger">{error}</p>}
      
      {userRole === 'admin' && (
        <section>
          <h3>Policy Details</h3>
          {policyDetails.length > 0 ? (
            <ul>
              {policyDetails.map((policy) => (
                <li key={policy.id}>
                  <p><strong>Policy Name:</strong> {policy.name}</p>
                  <p><strong>Description:</strong> {policy.description}</p>
                  <p><strong>Coverage:</strong> {policy.coverage}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No policies available.</p>
          )}
        </section>
      )}

      {userRole === 'admin' && (
        <section className="mt-4">
          <h3>Premium Information</h3>
          {premiumInfo ? (
            <div>
              <p><strong>Total Premium:</strong> ${premiumInfo.totalPremium}</p>
              <p><strong>Next Due Date:</strong> {premiumInfo.nextDueDate}</p>
            </div>
          ) : (
            <p>Premium information not available.</p>
          )}
        </section>
      )}

      <section className="mt-4">
        <h3>Claim History</h3>
        {claimHistory.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Claim ID</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Submission Date</th>
              </tr>
            </thead>
            <tbody>
              {claimHistory.map((claim) => (
                <tr key={claim.id}>
                  <td>{claim.id}</td>
                  <td>{claim.description}</td>
                  <td>${claim.amount}</td>
                  <td>{claim.status}</td>
                  <td>{claim.submissionDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No claims submitted.</p>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
