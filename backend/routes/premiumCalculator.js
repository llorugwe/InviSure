// backend/routes/premiumCalculator.js

const express = require('express');
const router = express.Router();
const calculatePremium = require('../utils/premiumCalculator');
const insuranceMetadata = require('../config/insuranceMetadata'); // Import metadata for validation
const Policy = require('../models/Policy'); // Import Policy model to check premium type

// POST /api/premium/calculate - Calculate premium based on risk data or return fixed premium
router.post('/calculate', async (req, res) => {
  const { insuranceType, policyId, riskData } = req.body;

  try {
    // Step 1: Fetch the policy from the database to determine premium type
    const policy = await Policy.findById(policyId);
    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }

    // Step 2: Check if the policy premium is Fixed or Dynamic
    if (policy.premiumType === 'Fixed') {
      // If fixed, return the predefined premium amount without recalculating
      return res.status(200).json({ premium: policy.premiumAmount });
    }

    // Step 3: If Dynamic, validate insuranceType and riskData
    if (!insuranceType || !insuranceMetadata[insuranceType]) {
      return res.status(400).json({ message: 'Invalid or missing insurance type' });
    }

    // Ensure riskData includes all required fields as per metadata
    const requiredFields = insuranceMetadata[insuranceType];
    const missingFields = requiredFields
      .filter(field => field.required && riskData[field.name] === undefined)
      .map(field => field.name);

    if (missingFields.length > 0) {
      return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
    }

    // Step 4: Calculate the premium using the provided insurance type and risk data
    const premium = calculatePremium(insuranceType, riskData);
    res.status(200).json({ premium });
  } catch (error) {
    console.error("Error calculating premium:", error);
    res.status(500).json({ message: 'Error calculating premium' });
  }
});

module.exports = router;
