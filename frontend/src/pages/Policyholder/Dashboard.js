import React, { useEffect, useState } from 'react';
import { getClaims, getTotalPolicies, getPendingClaims } from '../../services/claimsService';

const Dashboard = () => {
  const [policyDetails, setPolicyDetails] = useState([]);
  const [premiumInfo, setPremiumInfo] = useState(null);
  const [claimHistory, setClaimHistory] = useState([]);
  const [error, setError] = useState(null);

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await api.get('/user/dashboard', {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        });
        setPolicyDetails(data.policyDetails);
        setPremiumInfo(data.premiumInfo);
        setClaimHistory(data.claimHistory);
      } catch (error) {
        setError('Failed to load dashboard data.');
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();

    // Optional polling for real-time status updates every 30 seconds
    const intervalId = setInterval(fetchDashboardData, 30000); // Polling every 30 seconds
    return () => clearInterval(intervalId);  // Cleanup on component unmount
  }, []);

  return (
    <div className="container mt-5">
      <h2>User Dashboard</h2>
      {error && <p className="alert alert-danger">{error}</p>}
      
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
