const express = require('express');
const InsurancePlan = require('../models/InsurancePlan');
const Policy = require('../models/Policy');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Create a new insurance plan (admin only)
router.post('/', authMiddleware('admin'), async (req, res) => {
    const { name, description, premium, coverage, riskFactors, isAvailable } = req.body;
    try {
        const newPlan = new InsurancePlan({
            name,
            description,
            premium,
            coverage,
            riskFactors,
            isAvailable: isAvailable || true // Default to available unless specified
        });
        await newPlan.save();
        res.status(201).json(newPlan);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Public endpoint to get all available insurance plans (publicly accessible)
router.get('/', async (req, res) => {
    try {
        const plans = await InsurancePlan.find({ isAvailable: true }).select(
            'policyName description premiumAmount coverageAmount isAvailable'
        ); // Only return available plans with specified fields
        res.status(200).json(plans);
    } catch (err) {
        console.error('Error fetching available insurance plans:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get a specific insurance plan by ID (publicly accessible)
router.get('/:id', async (req, res) => {
    try {
        const plan = await InsurancePlan.findById(req.params.id);
        if (!plan || !plan.isAvailable) {
            return res.status(404).json({ message: 'Plan not found or unavailable' });
        }
        res.status(200).json(plan);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Purchase an insurance plan (policyholder only)
router.post('/:id/purchase', authMiddleware('policyholder'), async (req, res) => {
    try {
        const userId = req.user.userId;
        const plan = await InsurancePlan.findById(req.params.id);
        if (!plan || !plan.isAvailable) {
            return res.status(404).json({ message: 'Plan not available for purchase' });
        }

        // Create a new Policy for the user based on the InsurancePlan
        const newPolicy = new Policy({
            userId,
            insurancePlanId: plan._id,
            policyName: plan.name,
            description: plan.description,
            coverageAmount: plan.coverage,
            startDate: new Date(),
            endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // Default to 1-year duration
            status: 'active',
            premium: {
                amount: plan.premium,
                nextDueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)), // First due date 1 month later
                paymentStatus: 'pending',
                totalPaid: 0,
                balanceDue: plan.premium,
            }
        });
        
        await newPolicy.save();
        res.status(200).json({ message: 'Insurance plan purchased successfully', policy: newPolicy });
    } catch (err) {
        console.error('Error purchasing insurance plan:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update an insurance plan (admin only)
router.put('/:id', authMiddleware('admin'), async (req, res) => {
    try {
        const updatedPlan = await InsurancePlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPlan) return res.status(404).json({ message: 'Plan not found' });
        res.status(200).json(updatedPlan);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete an insurance plan (admin only)
router.delete('/:id', authMiddleware('admin'), async (req, res) => {
    try {
        const deletedPlan = await InsurancePlan.findByIdAndDelete(req.params.id);
        if (!deletedPlan) return res.status(404).json({ message: 'Plan not found' });
        res.status(200).json({ message: 'Plan deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
