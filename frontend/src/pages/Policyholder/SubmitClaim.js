import React, { useState } from 'react';

const SubmitClaim = () => {
  const [claim, setClaim] = useState({
    policyNumber: '',
    description: '',
    amount: '',
  });

  const handleChange = (e) => {
    setClaim({
      ...claim,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here, we will integrate with the backend to submit the claim
    console.log('Claim Submitted:', claim);
  };

  return (
    <div>
      <h2>Submit a Claim</h2>
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
    </div>
  );
};

export default SubmitClaim;
