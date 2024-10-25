function calculatePremium(basePremium, riskFactors) {
    let adjustedPremium = basePremium;

    // Apply a risk factor for each relevant attribute
    if (riskFactors.includes('age')) adjustedPremium *= 1.1; // Example: increase by 10% for age
    if (riskFactors.includes('health condition')) adjustedPremium *= 1.2; // Example: increase by 20% for health conditions

    // Other factors can be added as needed
    return adjustedPremium;
}

module.exports = calculatePremium;
