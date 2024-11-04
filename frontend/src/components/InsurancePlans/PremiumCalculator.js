// src/components/InsurancePlans/PremiumCalculator.js
import React from 'react';

const PremiumCalculator = ({ premium, onConfirmPurchase }) => {
  const handlePurchaseConfirmation = () => {
    if (onConfirmPurchase) {
      onConfirmPurchase();
    } else {
      console.warn("Purchase function is not provided.");
    }
  };

  return (
    <div className="premium-calculator mt-4">
      <h3>Calculated Monthly Premium: R {premium.toLocaleString()}</h3>
      <p>This premium is based on the information provided in the risk assessment form.</p>
      <button 
        onClick={handlePurchaseConfirmation} 
        className="btn btn-primary mt-3"
      >
        Confirm Purchase
      </button>
    </div>
  );
};

export default PremiumCalculator;
