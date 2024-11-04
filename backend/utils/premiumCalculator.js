// backend/utils/premiumCalculator.js

const insuranceMetadata = require('../config/insuranceMetadata');

function calculatePremium(insuranceType, riskData) {
  const metadata = insuranceMetadata[insuranceType];
  if (!metadata) throw new Error("Invalid insurance type");

  let basePremium = 100; // Initial base premium amount

  metadata.forEach(field => {
    const userValue = riskData[field.name];
    const { factor, type, options } = field;

    // Only calculate premium if user provided a value for the field
    if (userValue !== undefined && factor) {
      
      if (type === "number") {
        // For numeric fields, apply the factor proportionally
        basePremium += userValue * factor;

      } else if (type === "select" && options) {
        // For select fields, apply different logic based on the user's choice
        const optionFactor = options.includes(userValue) ? factor : 1; // Default to no increase if value isn't an option
        basePremium *= optionFactor;

      } else if (type === "text") {
        // Apply a static factor for non-empty text fields that add to risk (e.g., occupation)
        if (userValue.trim() !== "") {
          basePremium += factor;
        }
      }
    }
  });

  return basePremium;
}

module.exports = calculatePremium;
