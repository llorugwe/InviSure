const express = require('express');
const router = express.Router();
const Claim = require('../models/Claim');
const authMiddleware = require('../middlewares/authMiddleware');

// Route for policyholders to submit a new claim
router.post('/submit', authMiddleware(['policyholder']), async (req, res) => {
    const { policyId, description, amount } = req.body;
    const userId = req.user.userId;

    try {
        const newClaim = new Claim({ policyId, userId, description, amount });
        await newClaim.save();
        res.status(201).json({ message: 'Claim submitted successfully', claim: newClaim });
    } catch (err) {
        console.error('Error submitting claim:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route for policyholders to view their claims with populated policy details
router.get('/', authMiddleware(['policyholder']), async (req, res) => {
    const userId = req.user.userId;

    try {
        const claims = await Claim.find({ userId })
            .populate('policyId', 'policyName coverageAmount insuranceType') // Populate policyName and other necessary fields
            .select('policyId description amount status submittedAt updatedAt') // Select necessary fields including submittedAt
            .sort({ submittedAt: -1 }); // Sort by newest claims first

        res.status(200).json(claims);
    } catch (err) {
        console.error('Error retrieving claims:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
