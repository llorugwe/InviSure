import React, { useState, useEffect } from 'react';
import { getClaims } from '../../services/claimsService';

const TrackClaim = () => {
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

  return (
    <div className="container mt-5">
      <h2 className="text-center">Track Your Claims</h2>
      {error && <p className="alert alert-danger">{error}</p>}
      {claims.length > 0 ? (
        <table className="table table-striped table-bordered mt-4">
          <thead>
            <tr>
              <th>Policy Name</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date Submitted</th> {/* New column for Date Submitted */}
            </tr>
          </thead>
          <tbody>
            {claims.map((claim) => (
              <tr key={claim._id}>
                <td>{claim.policyId?.policyName || 'N/A'}</td>
                <td>{claim.description}</td>
                <td>R {claim.amount?.toLocaleString()}</td>
                <td>{claim.status}</td>
                <td>{new Date(claim.submittedAt).toLocaleDateString()}</td> {/* Format Date Submitted */}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="alert alert-info">No claims found.</p>
      )}
    </div>
  );
};

export default TrackClaim;
