// backend/routes/policies.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const Policy = require('../models/Policy');

// GET /api/policies - Retrieve all policies for the authenticated policyholder with optional filtering by insuranceType
router.get('/', authMiddleware('policyholder'), async (req, res) => {
    console.log('GET /api/policies request received'); // Log the request

    try {
        const userId = req.user.userId;
        const { insuranceType } = req.query; // Retrieve optional insuranceType query parameter

        console.log(`Fetching policies for user ID: ${userId} with type: ${insuranceType || 'all'}`); // Log user ID and type

        // Filter policies by userId and optional insuranceType
        const filter = { userId };
        if (insuranceType) {
            filter.insuranceType = insuranceType; // Apply type filter if provided
        }

        const policies = await Policy.find(filter)
            .select('policyName description coverageAmount premiumAmount insuranceType startDate endDate status');
        
        console.log('Policies retrieved:', policies); // Log retrieved policies

        if (policies.length === 0) {
            console.log('No policies found for this user');
            return res.status(404).json({ message: 'No policies found for this user' });
        }

        res.json(policies);
    } catch (err) {
        console.error('Error retrieving policies:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/policies/:id - View specific policy details
router.get('/:id', authMiddleware(['policyholder']), async (req, res) => {
    console.log(`GET /api/policies/${req.params.id} request received`); // Log the request

    try {
        const userId = req.user.userId;
        console.log(`Fetching policy with ID: ${req.params.id} for user ID: ${userId}`); // Log user and policy ID

        const policy = await Policy.findOne({ _id: req.params.id, userId });

        if (!policy) {
            console.log('Policy not found or access denied');
            return res.status(404).json({ message: 'Policy not found or access denied' });
        }

        console.log('Policy details retrieved:', policy); // Log the retrieved policy
        res.status(200).json(policy);
    } catch (err) {
        console.error('Error retrieving policy:', err);
        res.status(500).json({ message: 'Server error: unable to retrieve policy details' });
    }
});

// PUT /api/policies/:id - Update policy (e.g., payment status, beneficiary details)
router.put('/:id', authMiddleware(['policyholder']), async (req, res) => {
    console.log(`PUT /api/policies/${req.params.id} request received`); // Log the request

    try {
        const userId = req.user.userId;
        const updateData = req.body;
        console.log(`Updating policy with ID: ${req.params.id} for user ID: ${userId} with data:`, updateData); // Log update data

        const policy = await Policy.findOneAndUpdate(
            { _id: req.params.id, userId },
            updateData,
            { new: true }
        );

        if (!policy) {
            console.log('Policy not found or access denied');
            return res.status(404).json({ message: 'Policy not found or access denied' });
        }

        console.log('Policy updated successfully:', policy); // Log the updated policy
        res.status(200).json({ message: 'Policy updated successfully', policy });
    } catch (err) {
        console.error('Error updating policy:', err);
        res.status(500).json({ message: 'Server error: unable to update policy' });
    }
});

// DELETE /api/policies/:id - Request policy termination
router.delete('/:id', authMiddleware(['policyholder']), async (req, res) => {
    console.log(`DELETE /api/policies/${req.params.id} request received`); // Log the request

    try {
        const userId = req.user.userId;
        console.log(`Attempting to delete policy with ID: ${req.params.id} for user ID: ${userId}`); // Log deletion attempt

        const policy = await Policy.findOneAndDelete({ _id: req.params.id, userId });

        if (!policy) {
            console.log('Policy not found or access denied');
            return res.status(404).json({ message: 'Policy not found or access denied' });
        }

        console.log('Policy termination request successful'); // Log successful deletion
        res.status(200).json({ message: 'Policy termination request successful' });
    } catch (err) {
        console.error('Error terminating policy:', err);
        res.status(500).json({ message: 'Server error: unable to terminate policy' });
    }
});

// POST /api/policies - Create a new policy with insuranceType
router.post('/', authMiddleware('admin'), async (req, res) => {
    console.log('POST /api/policies request received for policy creation'); // Log request

    try {
        const { policyName, description, coverageAmount, premiumAmount, insuranceType, userId, insurancePlanId } = req.body;

        // Validate if insuranceType is provided
        if (!insuranceType || !['Health', 'Life', 'Car'].includes(insuranceType)) {
            return res.status(400).json({ message: 'Invalid or missing insurance type' });
        }

        // Create and save the new policy
        const newPolicy = new Policy({
            policyName,
            description,
            coverageAmount,
            premiumAmount,
            insuranceType,
            userId,
            insurancePlanId
        });
        
        await newPolicy.save();
        console.log('New policy created:', newPolicy); // Log created policy
        res.status(201).json({ message: 'Policy created successfully', policy: newPolicy });
    } catch (err) {
        console.error('Error creating policy:', err);
        res.status(500).json({ message: 'Server error: unable to create policy' });
    }
});

module.exports = router;
