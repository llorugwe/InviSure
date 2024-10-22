import React, { useState } from 'react';
import { submitClaim } from '../../services/claimsService';

const SubmitClaim = () => {
  const [claim, setClaim] = useState({
    policyNumber: '',
    description: '',
    amount: '',
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setClaim({
      ...claim,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitClaim(claim);
      setSuccess(true);
    } catch (err) {
      setError('Failed to submit claim. Please try again.');
    }
  };

  return (
    <div>
      <h2>Submit a Claim</h2>
      {success ? (
        <p>Your claim was successfully submitted!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <label>
            Policy Number:
            <input
              type="text"
              name="policyNumber"
              value={claim.policyNumber}
              onChange={handleChange}
              required
            />
          </label>
          <br />
          <label>
            Description:
            <input
              type="text"
              name="description"
              value={claim.description}
              onChange={handleChange}
              required
            />
          </label>
          <br />
          <label>
            Amount:
            <input
              type="number"
              name="amount"
              value={claim.amount}
              onChange={handleChange}
              required
            />
          </label>
          <br />
          <button type="submit">Submit Claim</button>
        </form>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default SubmitClaim;
