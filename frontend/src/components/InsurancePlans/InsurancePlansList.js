// src/components/InsurancePlans/InsurancePlansList.js
import React, { useEffect, useState } from 'react';
import { getInsurancePlans } from '../../services/insurancePlansService';
import InsurancePlanDetails from './InsurancePlanDetails';

const InsurancePlansList = () => {
  const [groupedPlans, setGroupedPlans] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const plansData = await getInsurancePlans();

        // Group plans by insuranceType
        const grouped = plansData.reduce((acc, plan) => {
          const type = plan.insuranceType || 'Other'; // Default to 'Other' if no type is specified
          if (!acc[type]) acc[type] = [];
          acc[type].push(plan);
          return acc;
        }, {});

        setGroupedPlans(grouped);
      } catch (error) {
        setError('Failed to load insurance plans.');
        console.error('Error fetching insurance plans:', error);
      }
    };

    fetchPlans();
  }, []);

  return (
    <div className="container mt-5">
      <h2>Available Insurance Plans</h2>
      {error && <p className="alert alert-danger">{error}</p>}

      {/* Render grouped plans by insurance type */}
      {Object.keys(groupedPlans).length > 0 ? (
        Object.keys(groupedPlans).map((type) => (
          <div key={type} className="plan-category mb-4">
            <h3>{type} Insurance</h3>
            <ul className="list-unstyled">
              {groupedPlans[type].map((plan) => (
                <li key={plan._id} className="mb-3">
                  <InsurancePlanDetails plan={plan} />
                  <div>
                    <p><strong>Coverage:</strong> R {plan.coverageAmount.toLocaleString()}</p>
                    {/* Check if the plan has a fixed or dynamic premium */}
                    {plan.premiumType === 'Fixed' ? (
                      <p><strong>Premium:</strong> R {plan.premiumAmount.toLocaleString()} (Fixed)</p>
                    ) : (
                      <p><strong>Premium:</strong> Dynamic (Calculated based on risk assessment)</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>No insurance plans available at the moment. Please check back later.</p>
      )}
    </div>
  );
};

export default InsurancePlansList;
