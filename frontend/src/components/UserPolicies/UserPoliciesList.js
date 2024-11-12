import React, { useEffect, useState } from 'react';
import { getUserPolicies } from '../../services/policiesService';
import './UserPoliciesList.css';

const UserPoliciesList = () => {
  const [policies, setPolicies] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const policiesData = await getUserPolicies();
        setPolicies(policiesData);
      } catch (error) {
        setError('Failed to load policies.');
        console.error('Error fetching policies:', error);
      }
    };

    fetchPolicies();
  }, []);

  return (
    <div className="user-policies-list-container">
      {error && <p className="alert alert-danger">{error}</p>}
      <div className="policies-grid">
        {policies.map((policy) => (
          <div key={policy._id} className="policy-card">
            <h5>{policy.policyName}</h5>
            <p><strong>Description:</strong> {policy.description}</p>
            <p><strong>Coverage:</strong> R {policy.coverageAmount?.toLocaleString()}</p>
            <p><strong>Premium:</strong> R {policy.premiumAmount?.toLocaleString()}</p>
            <p><strong>Start Date:</strong> {policy.startDate ? new Date(policy.startDate).toLocaleDateString() : 'N/A'}</p>
            <p><strong>End Date:</strong> {policy.endDate ? new Date(policy.endDate).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Payment Status:</strong> {policy.paymentStatus || 'N/A'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserPoliciesList;
