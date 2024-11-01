import React from 'react';
import PurchaseButton from './PurchaseButton';

const InsurancePlanDetails = ({ plan }) => {
  return (
    <div>
      <h3>{plan.name}</h3>
      <p><strong>Description:</strong> {plan.description}</p>
      <p><strong>Coverage Amount:</strong> ${plan.coverageAmount}</p>
      <p><strong>Premium:</strong> ${plan.premium}</p>
      <PurchaseButton planId={plan.id} />
    </div>
  );
};

export default InsurancePlanDetails;
