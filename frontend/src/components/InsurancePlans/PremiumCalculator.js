// src/components/InsurancePlans/PremiumCalculator.js

import React from 'react';

const PremiumCalculator = ({ premium, onConfirmPurchase }) => {
  return (
    <div className="premium-calculator card p-4 mt-4">
      <h3>Calculated Monthly Premium: R {premium.toLocaleString()}</h3>
      <p>If you are satisfied with the premium, proceed with the purchase.</p>
      <button className="btn btn-primary mt-3" onClick={onConfirmPurchase}>
        Confirm Purchase
      </button>
    </div>
  );
};

export default PremiumCalculator;
