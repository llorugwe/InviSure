// src/components/InsurancePlans/PremiumCalculator.js
import React, { useEffect } from 'react';

const PremiumCalculator = ({ premium, onConfirmPurchase }) => {
  
  // Log the premium value on initial render to verify it’s correctly passed
  useEffect(() => {
    console.log("PremiumCalculator component mounted with premium:", premium);
  }, [premium]);

  const handlePurchaseConfirmation = () => {
    if (onConfirmPurchase) {
      console.log("Confirming purchase with premium:", premium);
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
