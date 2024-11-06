const insuranceMetadata = require('../config/insuranceMetadata');

function calculatePremium(insuranceType, riskData, coverageAmount) {
  const metadata = insuranceMetadata[insuranceType];
  if (!metadata) throw new Error("Invalid insurance type");

  let basePremium = coverageAmount; // Set base premium to the coverage amount

  metadata.forEach(field => {
    const userValue = riskData[field.name];
    const { factor, type, options } = field;

    // Only calculate premium if user provided a value for the field and the field has a factor
    if (userValue !== undefined && factor) {
      if (type === "number") {
        // For numeric fields, adjust basePremium by adding the result of userValue multiplied by the factor
        basePremium += userValue * factor;

      } else if (type === "select" && options) {
        // For select fields, find the corresponding factor for the chosen option
        const option = options.find(option => option.label === userValue);
        if (option) {
          basePremium *= option.value; // Multiply base premium by the option's specified value
        }

      } else if (type === "text") {
        // For text fields that add to risk, add the factor if the field is non-empty
        if (userValue.trim() !== "") {
          basePremium += factor;
        }
      }
    }
  });

  return basePremium;
}

module.exports = calculatePremium;
