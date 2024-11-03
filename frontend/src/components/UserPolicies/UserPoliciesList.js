import React, { useEffect, useState } from 'react';
import { getUserPolicies } from '../../services/policiesService';
import PolicyDetails from './PolicyDetails';
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
            <PolicyDetails policy={policy} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserPoliciesList;
