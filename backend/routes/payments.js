const express = require('express');
const router = express.Router();
const Policy = require('../models/Policy');
const authMiddleware = require('../middlewares/authMiddleware');

// Route for policyholders to view their payment status
router.get('/:policyId', authMiddleware('policyholder'), async (req, res) => {
    try {
        const policy = await Policy.findById(req.params.policyId);
        if (!policy) return res.status(404).json({ message: 'Policy not found' });
        res.status(200).json(policy.premium);
    } catch (err) {
        console.error('Error retrieving payment status:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route for policyholders to make a payment
router.post('/:policyId/pay', authMiddleware('policyholder'), async (req, res) => {
    const { amount } = req.body;

    try {
        const policy = await Policy.findById(req.params.policyId);
        if (!policy) return res.status(404).json({ message: 'Policy not found' });

        policy.premium.totalPaid += amount;
        policy.premium.balanceDue -= amount;

        if (policy.premium.balanceDue <= 0) {
            policy.premium.paymentStatus = 'paid';
        } else {
            policy.premium.paymentStatus = 'due';
        }

        await policy.save();
        res.status(200).json({ message: 'Payment successful', premium: policy.premium });
    } catch (err) {
        console.error('Error processing payment:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
