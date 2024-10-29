import React, { useState, useEffect } from 'react';
import { getClaims, updateClaimStatus } from '../../services/claimsService';

const ManageClaims = () => {
  const [claims, setClaims] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await getClaims();
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
    <div>
      <h2>Manage Claims</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {claims.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Policy Number</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {claims.map((claim) => (
              <tr key={claim._id}>
                <td>{claim.policyNumber}</td>
                <td>{claim.description}</td>
                <td>{claim.amount}</td>
                <td>{claim.status}</td>
                <td>
                  <button
                    onClick={() => handleStatusChange(claim._id, 'Approved')}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusChange(claim._id, 'Rejected')}
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
