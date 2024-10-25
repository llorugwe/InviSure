const InsurancePlan = require('../models/InsurancePlan');
const calculatePremium = require('../services/premiumCalculationService');

const calculatePremiumForPlan = async (req, res) => {
    const { planId, riskFactors } = req.body;  // planId is the insurance plan, and riskFactors is an array of factors affecting premium

    try {
        // Find the insurance plan by its ID
        const plan = await InsurancePlan.findById(planId);
        if (!plan) return res.status(404).json({ message: 'Insurance plan not found' });

        // Calculate the premium based on the base premium and risk factors
        const adjustedPremium = calculatePremium(plan.premium, riskFactors);

        res.status(200).json({ premium: adjustedPremium });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { calculatePremiumForPlan };
