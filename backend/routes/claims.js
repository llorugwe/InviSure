const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const Claim = require('../models/Claim');

// Endpoint: GET /claims - Fetches all claims for the authenticated policyholder
router.get('/', authMiddleware('policyholder'), async (req, res) => {
    try {
        const userId = req.user.userId;

        // Fetch all claims for the authenticated policyholder
        const claims = await Claim.find({ userId })
            .populate('policyId', 'policyName')
            .select('description amount status submissionDate resolutionDate notes');

        // Return an empty array with a 200 status if no claims are found
        res.status(200).json(claims);
    } catch (err) {
        console.error('Error fetching claims:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
