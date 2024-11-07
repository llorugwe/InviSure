import React, { useState, useEffect } from 'react';
import { submitClaim, getAvailablePolicies } from '../../services/claimsService';

const SubmitClaim = () => {
  const [policies, setPolicies] = useState([]);
  const [claim, setClaim] = useState({
    policyId: '',  // Change to policyId to match backend expectations
    description: '',
    amount: '',
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch available policies on component mount
  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const policiesData = await getAvailablePolicies();
        setPolicies(policiesData);
      } catch (error) {
        setError('Failed to load policies. Please try again later.');
      }
    };
    fetchPolicies();
  }, []);

  const handleChange = (e) => {
    setClaim({
      ...claim,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      await submitClaim(claim);
      setSuccess(true);
      setClaim({ policyId: '', description: '', amount: '' });  // Reset form
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
            <label htmlFor="policyId">Policy:</label>
            <select
              className="form-control"
              id="policyId"
              name="policyId"
              value={claim.policyId}
              onChange={handleChange}
              required
            >
              <option value="">Select your policy</option>
              {policies.map((policy) => (
                <option key={policy._id} value={policy._id}>
                  {policy.policyName}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              value={claim.description}
              onChange={handleChange}
              placeholder="Briefly describe the reason for your claim"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="amount">Amount (optional):</label>
            <input
              type="number"
              className="form-control"
              id="amount"
              name="amount"
              value={claim.amount}
              onChange={handleChange}
              placeholder="Enter claim amount in USD"
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
