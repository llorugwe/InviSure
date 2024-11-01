import React from 'react';

const PaymentStatus = ({ status, nextDueDate }) => {
  return (
    <div>
      <p><strong>Payment Status:</strong> {status}</p>
      {status !== 'paid' && nextDueDate && (
        <p><strong>Next Due Date:</strong> {nextDueDate}</p>
      )}
    </div>
  );
};

export default PaymentStatus;
