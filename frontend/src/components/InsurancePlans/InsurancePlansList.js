import React, { useEffect, useState } from 'react';
import { getInsurancePlans } from '../../services/insurancePlansService';
import InsurancePlanDetails from './InsurancePlanDetails';

const InsurancePlansList = () => {
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const plansData = await getInsurancePlans();
        setPlans(plansData);
      } catch (error) {
        setError('Failed to load insurance plans.');
        console.error('Error fetching insurance plans:', error);
      }
    };

    fetchPlans();
  }, []);

  return (
    <div>
      <h2>Available Insurance Plans</h2>
      {error && <p className="alert alert-danger">{error}</p>}
      <ul>
        {plans.map((plan) => (
          <li key={plan.id}>
            <InsurancePlanDetails plan={plan} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InsurancePlansList;
