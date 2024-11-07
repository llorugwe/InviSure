const express = require('express');
const router = express.Router();
const Claim = require('../models/Claim');
const authMiddleware = require('../middlewares/authMiddleware');

// Route for policyholders to submit a new claim
router.post('/submit', authMiddleware(['policyholder']), async (req, res) => {
    const { policyId, description } = req.body;
    const userId = req.user.userId;

    try {
        const newClaim = new Claim({ policyId, userId, description });
        await newClaim.save();
        res.status(201).json({ message: 'Claim submitted successfully', claim: newClaim });
    } catch (err) {
        console.error('Error submitting claim:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route for policyholders to view their claims
router.get('/', authMiddleware(['policyholder']), async (req, res) => {
    const userId = req.user.userId;

    try {
        const claims = await Claim.find({ userId });
        res.status(200).json(claims);
    } catch (err) {
        console.error('Error retrieving claims:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
