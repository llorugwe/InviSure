const insuranceMetadata = require('../config/insuranceMetadata');

// Set a more conservative monthly discount rate (e.g., 3% annually -> 0.0025 per month)
const discountRate = 0.0025;

// Helper function to apply discounting for multi-month policies
function calculateDiscountedPremium(amount, months) {
  return amount / Math.pow(1 + discountRate, months);
}

// Health insurance premium calculation for a 2-year policy (24 months)
function calculateHealthPremium(riskData, coverageAmount) {
  const maxAge = 75; // Upper age limit for the calculation range
  
  // Nonlinear age factor: Age has a stronger impact as it increases
  const ageFactor = 1 + Math.pow(riskData.age / maxAge, 2); // Quadratic impact relative to maxAge

  // Adjustments based on health conditions and smoking status
  const healthConditionFactor = parseFloat(riskData.healthConditions) || 1; // Baseline of 1 for no conditions
  const smokingStatusFactor = parseFloat(riskData.smokingStatus) || 1; // Baseline of 1 for non-smoker

  // Combined risk factor using age as a significant contributor
  const combinedRiskFactor = ageFactor * healthConditionFactor * smokingStatusFactor;

  // Adjusted coverage amount to prevent excessive premiums while accounting for combined risk
  const adjustedCoverage = coverageAmount * combinedRiskFactor * 0.02; // Scale down total premium

  // Calculate discounted present value of premiums over 2 years (24 months)
  let totalDiscountedValue = 0;
  for (let month = 1; month <= 24; month++) {
    totalDiscountedValue += calculateDiscountedPremium(adjustedCoverage, month);
  }

  // Monthly premium as the average of the total discounted value over 24 months
  const monthlyPremium = totalDiscountedValue / 24;
  return monthlyPremium;
}

// Life insurance premium calculation for whole life (40 years, or 480 months)
function calculateLifePremium(riskData, coverageAmount) {
  const maxLifeExpectancy = 80;

  // Age factor with a gentler exponential effect for nonlinear increase with age
  const ageFactor = 1 + Math.pow(riskData.age / maxLifeExpectancy, 1.5);

  // Lowered occupation and lifestyle factors to moderate the premium impact
  const occupationRiskFactor = parseFloat(riskData.occupationRisk) || 1;
  const lifestyleFactor = parseFloat(riskData.lifestyle) || 1;

  // Combined risk factor calculation
  const combinedRiskFactor = ageFactor * occupationRiskFactor * lifestyleFactor;

  // Further reduced coverage scaling factor
  const adjustedCoverage = coverageAmount * combinedRiskFactor * 0.005;

  // Calculate total discounted value for the policy duration
  let totalDiscountedValue = 0;
  for (let month = 1; month <= 480; month++) {
    totalDiscountedValue += calculateDiscountedPremium(adjustedCoverage, month);
  }

  // Monthly premium spread over 480 months
  return totalDiscountedValue / 480;
}

// Car insurance premium calculation for a 2-year policy (24 months)
function calculateCarPremium(riskData, coverageAmount) {
  const currentYear = new Date().getFullYear();
  const carAge = Math.max(1, currentYear - riskData.carYear); // Car age in years

  // Exponential factor to make car age significantly impact the premium
  const carAgeFactor = Math.pow(1.1, carAge); // 10% increase in risk per year, compounded

  // Driving record and location factors
  const drivingRecordFactor = parseFloat(riskData.drivingRecord) || 1; // Multiplier based on driving history
  const locationFactor = parseFloat(riskData.location) || 1; // Multiplier based on residential area risk

  // Combined risk factor for car insurance
  const combinedRiskFactor = carAgeFactor * drivingRecordFactor * locationFactor;

  // Adjust the coverage amount with combined risk factors
  const adjustedCoverage = coverageAmount * combinedRiskFactor * 0.02; // Higher scaling factor

  // Calculate the total discounted value over 24 months (2-year policy)
  let totalDiscountedValue = 0;
  for (let month = 1; month <= 24; month++) {
    totalDiscountedValue += calculateDiscountedPremium(adjustedCoverage, month);
  }

  // Monthly premium as the total discounted value spread over 24 months
  return totalDiscountedValue / 24;
}

// Home insurance premium calculation for a 2-year policy (24 months)
function calculateHomePremium(riskData, coverageAmount) {
  const homeAgeFactor = 1 + Math.max(1, riskData.homeAge * 0.01);
  const locationFactor = parseFloat(riskData.location) || 1;
  const constructionTypeFactor = parseFloat(riskData.constructionType) || 1;

  // Combined risk factor for home insurance
  const combinedRiskFactor = homeAgeFactor * locationFactor * constructionTypeFactor;

  // Adjusted coverage with conservative scaling for home insurance
  const adjustedCoverage = coverageAmount * combinedRiskFactor * 0.0025;

  // Calculate total discounted value over 24 months
  let totalDiscountedValue = 0;
  for (let month = 1; month <= 24; month++) {
    totalDiscountedValue += calculateDiscountedPremium(adjustedCoverage, month);
  }

  return totalDiscountedValue / 24;
}

// Travel insurance premium calculation for a 2-year policy (24 months)
function calculateTravelPremium(riskData, coverageAmount) {
  const destinationRiskFactor = parseFloat(riskData.destinationRisk) || 1;
  const durationFactor = 1 + Math.max(1, riskData.duration * 0.005); // Moderate increase for longer trips
  const purposeFactor = parseFloat(riskData.purpose) || 1;

  // Combined risk factor for travel insurance
  const combinedRiskFactor = destinationRiskFactor * durationFactor * purposeFactor;

  // Adjusted coverage amount for travel insurance
  const adjustedCoverage = coverageAmount * combinedRiskFactor * 0.005;

  // Calculate total discounted value over 24 months
  let totalDiscountedValue = 0;
  for (let month = 1; month <= 24; month++) {
    totalDiscountedValue += calculateDiscountedPremium(adjustedCoverage, month);
  }

  return totalDiscountedValue / 24;
}

// Main function
function calculatePremium(insuranceType, riskData, coverageAmount) {
  switch (insuranceType) {
    case 'Health':
      return calculateHealthPremium(riskData, coverageAmount);
    case 'Life':
      return calculateLifePremium(riskData, coverageAmount);
    case 'Car':
      return calculateCarPremium(riskData, coverageAmount);
    case 'Home':
      return calculateHomePremium(riskData, coverageAmount);
    case 'Travel':
      return calculateTravelPremium(riskData, coverageAmount);
    default:
      throw new Error("Unsupported insurance type");
  }
}

module.exports = calculatePremium;
