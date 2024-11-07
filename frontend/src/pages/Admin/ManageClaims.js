import React, { useState, useEffect } from 'react';
import { getAllClaims, updateClaimStatus } from '../../services/claimsService';
import './ManageClaims.css';

const ManageClaims = () => {
  const [claims, setClaims] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await getAllClaims();
        setClaims(response);
      } catch (err) {
        setError('Failed to load claims. Please try again.');
      }
    };
    fetchClaims();
  }, []);

  const handleStatusChange = async (claimId, newStatus) => {
    try {
      await updateClaimStatus(claimId, newStatus);
      const updatedClaims = claims.map((claim) =>
        claim._id === claimId ? { ...claim, status: newStatus } : claim
      );
      setClaims(updatedClaims);
    } catch (err) {
      setError('Failed to update claim status.');
    }
  };

  return (
    <div className="manage-claims-container">
      <h2>Manage Claims</h2>
      {error && <p className="error-text">{error}</p>}
      {claims.length > 0 ? (
        <table className="claims-table">
          <thead>
            <tr>
              <th>Policyholder Name</th>
              <th>Policy</th>
              <th>Description</th>
              <th>Claim Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {claims.map((claim) => (
              <tr key={claim._id}>
                <td>{claim.user?.name || 'No Name Available'}</td>
                <td>{claim.policy?.policyName || 'No Policy Name'}</td>
                <td>{claim.description}</td>
                <td>{claim.policy?.coverageAmount ? `R ${claim.policy.coverageAmount.toLocaleString()}` : 'Amount Not Available'}</td>
                <td>{claim.status}</td>
                <td className="action-buttons">
                  <button
                    onClick={() => handleStatusChange(claim._id, 'approved')}
                    disabled={claim.status === 'approved'}
                    className="approve-button"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusChange(claim._id, 'rejected')}
                    disabled={claim.status === 'rejected'}
                    className="reject-button"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No claims to manage.</p>
      )}
    </div>
  );
};

export default ManageClaims;
