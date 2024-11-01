import React from 'react';
import { purchaseInsurancePlan } from '../../services/insurancePlansService';

const PurchaseButton = ({ planId }) => {
  const handlePurchase = async () => {
    try {
      const response = await purchaseInsurancePlan(planId);
      alert(`Plan purchased successfully!`);
    } catch (error) {
      console.error('Error purchasing plan:', error);
      alert('Failed to purchase plan. Please try again.');
    }
  };

  return (
    <button onClick={handlePurchase} className="btn btn-primary">
      Purchase Plan
    </button>
  );
};

export default PurchaseButton;
