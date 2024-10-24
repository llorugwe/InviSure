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
    <div>
      <h2>Track Your Claims</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {claims.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Policy Number</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {claims.map((claim) => (
              <tr key={claim._id}>
                <td>{claim.policyNumber}</td>
                <td>{claim.description}</td>
                <td>{claim.amount}</td>
                <td>{claim.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No claims found.</p>
      )}
    </div>
  );
};

export default TrackClaim;
