import React, { useEffect, useState } from 'react'; 
import { getClaims, getPendingClaims } from '../../services/claimsService';
import { getPremiums, getUserPolicies } from '../../services/policiesService';
import { getPolicyPaymentDetails } from '../../services/paymentsService';
import { Link } from 'react-router-dom';
import UserPoliciesList from '../../components/UserPolicies/UserPoliciesList';

const Dashboard = () => {
  const [premiumInfo, setPremiumInfo] = useState(null);
  const [claimHistory, setClaimHistory] = useState([]);
  const [userPolicies, setUserPolicies] = useState([]);
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [error, setError] = useState(null);

  const userRole = localStorage.getItem('role');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (userRole === 'policyholder') {
          const policiesData = await getUserPolicies();
          setUserPolicies(policiesData);

          const premiumData = await getPremiums();
          setPremiumInfo(premiumData);

          const paymentPromises = policiesData.map(policy => getPolicyPaymentDetails(policy._id));
          const paymentResults = await Promise.all(paymentPromises);
          setPaymentDetails(paymentResults);
        } else if (userRole === 'admin') {
          const pendingClaimsData = await getPendingClaims();
          setPremiumInfo(pendingClaimsData);
        }

        const claimsData = await getClaims();
        setClaimHistory(claimsData);
      } catch (error) {
        setError('Failed to load dashboard data.');
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
    const intervalId = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(intervalId);
  }, [userRole]);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">{userRole === 'admin' ? 'Admin Dashboard' : 'User Dashboard'}</h2>
      {error && <p className="alert alert-danger">{error}</p>}

      {/* Policy Details Section for Policyholders */}
      {userRole === 'policyholder' && (
        <section className="card mb-4 p-3">
          <h3 className="mb-3">My Policies</h3>
          <UserPoliciesList policies={userPolicies} />
        </section>
      )}

      {/* Premium Information Section */}
      <section className="card mb-4 p-3">
        <h3 className="mb-3">Premium Information</h3>
        {premiumInfo ? (
          <div>
            <p><strong>Total Premium:</strong> R {premiumInfo.totalPremium?.toLocaleString()}</p>
            <p><strong>Next Due Date:</strong> {premiumInfo.nextDueDate ? new Date(premiumInfo.nextDueDate).toLocaleDateString() : 'N/A'}</p>
          </div>
        ) : (
          <p>Premium information not available.</p>
        )}
      </section>

      {/* Payments Due Section */}
      {userRole === 'policyholder' && paymentDetails.length > 0 && (
        <section className="card mb-4 p-3">
          <h3 className="mb-3">Payments Due</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Policy Name</th>
                <th>Amount Due</th>
                <th>Next Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {paymentDetails.map((payment, index) => (
                <tr key={index}>
                  <td>{userPolicies[index]?.policyName}</td>
                  <td>R {payment.balanceDue?.toLocaleString()}</td>
                  <td>{payment.nextDueDate ? new Date(payment.nextDueDate).toLocaleDateString() : 'N/A'}</td>
                  <td>{payment.paymentStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* Claims Section */}
      <section className="card mb-4 p-3">
        <h3 className="mb-3">Claim Management</h3>
        {claimHistory.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Policy</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Submission Date</th>
              </tr>
            </thead>
            <tbody>
              {claimHistory.map((claim) => (
                <tr key={claim._id}>
                  <td>{claim.policyId?.policyName || 'N/A'}</td> {/* Updated to show Policy Name */}
                  <td>{claim.description}</td>
                  <td>R {claim.amount?.toLocaleString()}</td>
                  <td>{claim.status}</td>
                  <td>{claim.submittedAt ? new Date(claim.submittedAt).toLocaleDateString() : 'N/A'}</td> {/* Corrected Submission Date */}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No claims submitted.</p>
        )}
        {/* Links to Submit and Track Claims */}
        {userRole === 'policyholder' && (
          <div className="text-center mt-3">
            <Link to="/submit-claim" className="btn btn-primary mx-2">
              Submit a New Claim
            </Link>
            <Link to="/track-claim" className="btn btn-secondary mx-2">
              Track Claims
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
