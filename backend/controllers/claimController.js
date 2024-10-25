const Claim = require('../models/Claim');
const InsurancePlan = require('../models/InsurancePlan');

// Submit a new claim
const submitClaim = async (req, res) => {
    const { planId, description, amount } = req.body;
    try {
        const newClaim = new Claim({
            userId: req.user.userId,  // Assuming the user ID is stored in the JWT payload
            planId,
            description,
            amount
        });
        await newClaim.save();
        res.status(201).json(newClaim);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Retrieve all claims for the logged-in user
const getUserClaims = async (req, res) => {
    try {
        const claims = await Claim.find({ userId: req.user.userId });
        res.status(200).json(claims);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin: Retrieve all claims
const getAllClaims = async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    try {
        const claims = await Claim.find().populate('userId', 'name').populate('planId', 'name');
        res.status(200).json(claims);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin: Update claim status (approve/reject)
const updateClaimStatus = async (req, res) => {
    const { claimId } = req.params;
    const { status } = req.body;  // Status should be either 'approved' or 'rejected'
    
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    try {
        const updatedClaim = await Claim.findByIdAndUpdate(claimId, { status }, { new: true });
        if (!updatedClaim) return res.status(404).json({ message: 'Claim not found' });
        res.status(200).json(updatedClaim);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { submitClaim, getUserClaims, getAllClaims, updateClaimStatus };
