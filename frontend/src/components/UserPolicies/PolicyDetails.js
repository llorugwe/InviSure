import React from 'react';
import PaymentStatus from './PaymentStatus';

const PolicyDetails = ({ policy }) => {
  return (
    <div>
      <h3>{policy.policyName}</h3>
      <p><strong>Description:</strong> {policy.description}</p>
      <p><strong>Coverage:</strong> ${policy.coverageAmount}</p>
      <p><strong>Premium:</strong> ${policy.premiumAmount}</p>
      <p><strong>Start Date:</strong> {policy.startDate}</p>
      <p><strong>End Date:</strong> {policy.endDate}</p>
      <PaymentStatus status={policy.paymentStatus} nextDueDate={policy.nextDueDate} />
    </div>
  );
};

export default PolicyDetails;
