const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const Policy = require('../models/Policy');

// Endpoint to retrieve all active premiums for a policyholder
router.get('/user-premiums', authMiddleware('policyholder'), async (req, res) => {
    try {
        const userId = req.user.userId;

        // Retrieve premium information related to the user’s active policies
        const premiums = await Policy.find({ userId, status: 'active' })
            .select('policyName premium');

        if (premiums.length === 0) {
            return res.status(404).json({ message: 'No active premiums found for this user' });
        }

        res.json(premiums);
    } catch (err) {
        console.error('Error fetching premiums:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
