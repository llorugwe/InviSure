const express = require('express');
const router = express.Router();
const calculatePremium = require('../utils/premiumCalculator');
const insuranceMetadata = require('../config/insuranceMetadata'); // Metadata for validation
const InsurancePlan = require('../models/InsurancePlan'); // Correct model to check premium type from `insuranceplans` collection
const mongoose = require('mongoose'); // Import mongoose for ObjectId conversion

// POST /api/premium/calculate - Calculate premium based on risk data or return fixed premium
router.post('/calculate', async (req, res) => {
  const { insuranceType, policyId, riskData } = req.body;

  console.log("Received premium calculation request:", { insuranceType, policyId, riskData });

  try {
    // Convert policyId to ObjectId if it's a valid string ID
    let planObjectId;
    if (mongoose.isValidObjectId(policyId)) {
      planObjectId = new mongoose.Types.ObjectId(policyId);
    } else {
      console.error("Invalid policy ID format:", policyId);
      return res.status(400).json({ message: 'Invalid policy ID format' });
    }
    
    console.log("Converted policyId to ObjectId:", planObjectId);

    // Verify connection and check available collections
    console.log("Checking if collection exists and is connected...");
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Existing collections:", collections.map(c => c.name));

    // Step 1: Fetch the insurance plan from the correct database collection
    const insurancePlan = await InsurancePlan.findById(planObjectId);

    if (!insurancePlan) {
      console.error("Insurance plan not found for ID:", policyId);
      return res.status(404).json({ message: 'Insurance plan not found' });
    }

    const { premiumType, premiumAmount, coverageAmount } = insurancePlan;
    console.log("Insurance plan found:", { premiumType, premiumAmount, coverageAmount, insuranceType: insurancePlan.insuranceType });

    // Step 2: Check if the insurance plan's premium is Fixed or Dynamic
    if (premiumType === 'Fixed') {
      console.log("Fixed premium insurance plan. Returning premium amount:", premiumAmount);
      return res.status(200).json({ premium: premiumAmount });
    }

    // Step 3: If Dynamic, validate insuranceType and riskData
    if (!insuranceType || !insuranceMetadata[insuranceType]) {
      console.error("Invalid or missing insurance type:", insuranceType);
      return res.status(400).json({ message: 'Invalid or missing insurance type' });
    }

    console.log("Insurance metadata fields required for validation:", insuranceMetadata[insuranceType]);

    // Ensure riskData includes all required fields as per metadata
    const requiredFields = insuranceMetadata[insuranceType];
    const missingFields = requiredFields
      .filter(field => field.required && riskData[field.name] === undefined)
      .map(field => field.name);

    if (missingFields.length > 0) {
      console.error("Missing required fields in risk data:", missingFields);
      return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
    }

    // Step 4: Calculate the premium using the provided insurance type, risk data, and coverageAmount as the base
    console.log("Calculating premium with insurance type, risk data, and coverage amount:", { insuranceType, riskData, coverageAmount });
    const premium = calculatePremium(insuranceType, riskData, coverageAmount);
    console.log("Calculated premium:", premium);
    
    res.status(200).json({ premium });
  } catch (error) {
    console.error("Error calculating premium:", error);
    res.status(500).json({ message: 'Error calculating premium' });
  }
});

module.exports = router;
