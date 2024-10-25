const Claim = require('../models/Claim');
const InsurancePlan = require('../models/InsurancePlan');

// Submit a new claim
const submitClaim = async (req, res) => {
    const { planId, description, amount } = req.body;
    try {
        // Check if the plan ID exists
        const insurancePlan = await InsurancePlan.findById(planId);
        if (!insurancePlan) {
            return res.status(404).json({ message: 'Insurance plan not found' });
        }

        // Create a new claim
        const newClaim = new Claim({
            userId: req.user.userId,  // Assuming user ID is stored in the JWT payload
            planId,
            description,
            amount
        });
        await newClaim.save();

        res.status(201).json(newClaim);
    } catch (err) {
        console.error('Error during claim submission:', err);  // Log the error
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Retrieve all claims for the logged-in user
const getUserClaims = async (req, res) => {
    try {
        const claims = await Claim.find({ userId: req.user.userId });
        res.status(200).json(claims);
    } catch (err) {
        console.error('Error retrieving user claims:', err);  // Log the error
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Admin: Retrieve all claims
const getAllClaims = async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }
    try {
        const claims = await Claim.find()
            .populate('userId', 'name')
            .populate('planId', 'name');
        res.status(200).json(claims);
    } catch (err) {
        console.error('Error retrieving all claims:', err);  // Log the error
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Admin: Update claim status (approve/reject)
const updateClaimStatus = async (req, res) => {
    const { claimId } = req.params;
    const { status } = req.body;  // Status should be either 'approved' or 'rejected'

    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }

    try {
        // Ensure valid status
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const updatedClaim = await Claim.findByIdAndUpdate(claimId, { status }, { new: true });
        if (!updatedClaim) {
            return res.status(404).json({ message: 'Claim not found' });
        }

        res.status(200).json(updatedClaim);
    } catch (err) {
        console.error('Error updating claim status:', err);  // Log the error
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = { submitClaim, getUserClaims, getAllClaims, updateClaimStatus };
