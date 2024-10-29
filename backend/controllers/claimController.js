const Claim = require('../models/Claim');
const Policy = require('../models/Policy');
const User = require('../models/User');

// Submit a new claim with document upload
const submitClaim = async (req, res) => {
    const { policyId, description, amountRequested } = req.body;

    try {
        // Check if the policy ID exists
        const policy = await Policy.findById(policyId);
        if (!policy) {
            return res.status(404).json({ message: 'Policy not found' });
        }

        // Create a new claim
        const newClaim = new Claim({
            user: req.user.userId,  // Assuming user ID is available in the JWT payload
            policy: policyId,
            description,
            amountRequested,
            documents: req.files ? req.files.map(file => file.path) : [] // Store uploaded document paths
        });

        await newClaim.save();

        // Update the user's claim list
        await User.findByIdAndUpdate(req.user.userId, { $push: { claims: newClaim._id } });

        res.status(201).json({ message: 'Claim submitted successfully', claim: newClaim });
    } catch (err) {
        console.error('Error during claim submission:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Retrieve all claims for the logged-in user
const getUserClaims = async (req, res) => {
    try {
        const claims = await Claim.find({ user: req.user.userId })
            .populate('policy', 'name basePremium')
            .sort({ submittedAt: -1 });  // Sort by newest first
        res.status(200).json(claims);
    } catch (err) {
        console.error('Error retrieving user claims:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Admin: Retrieve all claims with user and policy details
const getAllClaims = async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }
    try {
        const claims = await Claim.find()
            .populate('user', 'name email')
            .populate('policy', 'name basePremium')
            .sort({ submittedAt: -1 });
        res.status(200).json(claims);
    } catch (err) {
        console.error('Error retrieving all claims:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Admin: Update claim status with extended options (e.g., in review, approved, rejected)
const updateClaimStatus = async (req, res) => {
    const { claimId } = req.params;
    const { status } = req.body;

    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }

    // Validate status
    const validStatuses = ['submitted', 'in review', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
    }

    try {
        const updatedClaim = await Claim.findByIdAndUpdate(
            claimId,
            { status },
            { new: true }
        );

        if (!updatedClaim) {
            return res.status(404).json({ message: 'Claim not found' });
        }

        res.status(200).json({ message: 'Claim status updated successfully', claim: updatedClaim });
    } catch (err) {
        console.error('Error updating claim status:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = { submitClaim, getUserClaims, getAllClaims, updateClaimStatus };
