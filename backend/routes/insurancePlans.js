const express = require('express');
const InsurancePlan = require('../models/InsurancePlan');
const Policy = require('../models/Policy');
const authMiddleware = require('../middlewares/authMiddleware');
const { getAvailablePolicies } = require('../controllers/adminController');

const router = express.Router();

// Create a new insurance plan (admin only)
router.post('/', authMiddleware('admin'), async (req, res) => {
    console.log('POST /api/policies request received for policy creation');

    try {
        const { policyName, description, premiumType, premiumAmount, coverageAmount, insuranceType, userId, insurancePlanId } = req.body;

        // Validate required fields
        if (!policyName || !description || !coverageAmount || !insuranceType || !premiumType) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Validate premiumType logic
        if (premiumType === 'Fixed') {
            // If premium type is fixed, ensure a premium amount is provided
            if (premiumAmount === null || premiumAmount === undefined) {
                return res.status(400).json({ message: 'Fixed premium type requires a premium amount' });
            }
        } else if (premiumType === 'Dynamic') {
            // If premium type is dynamic, set premiumAmount to null
            req.body.premiumAmount = null;
        } else {
            return res.status(400).json({ message: 'Invalid premium type' });
        }

        // Create and save the new policy
        const newPolicy = new Policy({
            policyName,
            description,
            premiumType,
            premiumAmount: req.body.premiumAmount, // For dynamic, this will be null
            coverageAmount,
            insuranceType,
            userId,
            insurancePlanId
        });
        
        await newPolicy.save();
        console.log('New policy created:', newPolicy);
        res.status(201).json({ message: 'Policy created successfully', policy: newPolicy });
    } catch (err) {
        console.error('Error creating policy:', err);
        res.status(500).json({ message: 'Server error: unable to create policy' });
    }
});

// Public endpoint to get all available insurance plans
router.get('/available', async (req, res) => {
    console.log('GET /insurance-plans/available request received');
    try {
        const plans = await InsurancePlan.getAvailablePolicies();
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
router.post('/:id/purchase', authMiddleware(['policyholder']), async (req, res) => {
    try {
        const userId = req.user.userId;
        const plan = await InsurancePlan.findById(req.params.id);
        if (!plan || !plan.isAvailable) {
            return res.status(404).json({ message: 'Plan not available for purchase' });
        }

        const newPolicy = new Policy({
            userId,
            insurancePlanId: plan._id,
            policyName: plan.policyName,
            description: plan.description,
            coverageAmount: plan.coverageAmount,
            insuranceType: plan.insuranceType, // Include insuranceType here
            startDate: new Date(),
            endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // Default to 1-year duration
            status: 'active',
            premium: {
                amount: plan.premiumAmount,
                nextDueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)), // First due date 1 month later
                paymentStatus: 'pending',
                totalPaid: 0,
                balanceDue: plan.premiumAmount,
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
router.put('/:id', authMiddleware(['admin']), async (req, res) => {
    try {
        const updatedPlan = await InsurancePlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPlan) return res.status(404).json({ message: 'Plan not found' });
        res.status(200).json(updatedPlan);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete an insurance plan (admin only)
router.delete('/:id', authMiddleware(['admin']), async (req, res) => {
    try {
        const deletedPlan = await InsurancePlan.findByIdAndDelete(req.params.id);
        if (!deletedPlan) return res.status(404).json({ message: 'Plan not found' });
        res.status(200).json({ message: 'Plan deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
