import React, { useEffect, useState } from 'react';
import { getClaims, getPremiums, getTotalPolicies, getPendingClaims } from '../../services/claimsService';
import UserPoliciesList from '../../components/UserPolicies/UserPoliciesList'; // Import UserPoliciesList component

const Dashboard = () => {
  const [premiumInfo, setPremiumInfo] = useState(null);
  const [claimHistory, setClaimHistory] = useState([]);
  const [error, setError] = useState(null);

  // Check the user's role
  const userRole = localStorage.getItem('role');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch common data (claim history)
        const claimsData = await getClaims();
        setClaimHistory(claimsData);

        // Fetch premium information based on role
        if (userRole === 'admin') {
          // Fetch admin-specific premium data
          const pendingClaimsData = await getPendingClaims();
          setPremiumInfo(pendingClaimsData);
        } else if (userRole === 'policyholder') {
          // Fetch policyholder-specific premium data
          const premiumData = await getPremiums();
          setPremiumInfo(premiumData);
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

      {/* Policy Details Section - Show UserPoliciesList for policyholders */}
      {userRole === 'policyholder' && (
        <section className="mt-4">
          <h3>My Policies</h3>
          <UserPoliciesList /> {/* Display UserPoliciesList for the policyholder */}
        </section>
      )}

      {/* Premium Information Section */}
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

      {/* Claim History Section */}
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
