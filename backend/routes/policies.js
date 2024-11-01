// backend/routes/policies.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const Policy = require('../models/Policy'); // Assumes Policy model exists

// GET /api/policies - Retrieve all policies for the authenticated policyholder
router.get('/', authMiddleware('policyholder'), async (req, res) => {
    try {
        const userId = req.user.userId;
        const policies = await Policy.find({ userId })
            .select('policyName description coverageAmount premiumAmount startDate endDate status');

        if (policies.length === 0) {
            return res.status(404).json({ message: 'No policies found for this user' });
        }

        res.json(policies);
    } catch (err) {
        console.error('Error retrieving policies:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
