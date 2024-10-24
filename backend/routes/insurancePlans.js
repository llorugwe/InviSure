const express = require('express');
const InsurancePlan = require('../models/InsurancePlan');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Create a new insurance plan (admin only)
router.post('/', authMiddleware, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    const { name, description, premium, coverage, riskFactors } = req.body;
    try {
        const newPlan = new InsurancePlan({ name, description, premium, coverage, riskFactors });
        await newPlan.save();
        res.status(201).json(newPlan);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all insurance plans (available to all users)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const plans = await InsurancePlan.find();
        res.status(200).json(plans);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get a specific insurance plan by ID (available to all users)
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const plan = await InsurancePlan.findById(req.params.id);
        if (!plan) return res.status(404).json({ message: 'Plan not found' });
        res.status(200).json(plan);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update an insurance plan (admin only)
router.put('/:id', authMiddleware, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    try {
        const updatedPlan = await InsurancePlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPlan) return res.status(404).json({ message: 'Plan not found' });
        res.status(200).json(updatedPlan);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete an insurance plan (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    try {
        const deletedPlan = await InsurancePlan.findByIdAndDelete(req.params.id);
        if (!deletedPlan) return res.status(404).json({ message: 'Plan not found' });
        res.status(200).json({ message: 'Plan deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
