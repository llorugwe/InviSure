// src/components/InsurancePlans/PremiumCalculator.js
import React, { useEffect } from 'react';

const PremiumCalculator = ({ premium }) => {

  // Log the premium value on initial render to verify it’s correctly passed
  useEffect(() => {
    console.log("PremiumCalculator component mounted with premium:", premium);
  }, [premium]);

  return (
    <div className="premium-calculator mt-4">
      <h3>Calculated Monthly Premium: R {premium.toLocaleString()}</h3>
      <p>This premium is based on the information provided in the risk assessment form.</p>
    </div>
  );
};

export default PremiumCalculator;
