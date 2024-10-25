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
    <div className="container mt-5">
      <h2 className="text-center">Submit a Claim</h2>
      {success ? (
        <p className="alert alert-success">Your claim was successfully submitted!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="policyNumber">Policy Number:</label>
            <input
              type="text"
              className="form-control"
              id="policyNumber"
              name="policyNumber"
              value={claim.policyNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <input
              type="text"
              className="form-control"
              id="description"
              name="description"
              value={claim.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="amount">Amount:</label>
            <input
              type="number"
              className="form-control"
              id="amount"
              name="amount"
              value={claim.amount}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary mt-3">
            Submit Claim
          </button>
        </form>
      )}
      {error && <p className="alert alert-danger">{error}</p>}
    </div>
  );
};

export default SubmitClaim;
