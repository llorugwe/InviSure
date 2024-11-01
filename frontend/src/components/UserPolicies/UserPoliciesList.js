import React, { useEffect, useState } from 'react';
import { getUserPolicies } from '../../services/policiesService'; // Update import
import PolicyDetails from './PolicyDetails';

const UserPoliciesList = () => {
  const [policies, setPolicies] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const policiesData = await getUserPolicies(); // Update function call
        setPolicies(policiesData);
      } catch (error) {
        setError('Failed to load policies.');
        console.error('Error fetching policies:', error);
      }
    };

    fetchPolicies();
  }, []);

  return (
    <div>
      <h2>My Policies</h2>
      {error && <p className="alert alert-danger">{error}</p>}
      <ul>
        {policies.map((policy) => (
          <li key={policy.id}>
            <PolicyDetails policy={policy} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserPoliciesList;
