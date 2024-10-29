const Policy = require('../models/Policy');
const Claim = require('../models/Claim');

// Endpoint to get the total number of active insurance policies
const getTotalPolicies = async (req, res) => {
    try {
        const total = await Policy.countDocuments();
        res.status(200).json({ total });
    } catch (error) {
        console.error('Error retrieving total policies:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Endpoint to get the count of pending claims
const getPendingClaims = async (req, res) => {
    try {
        const pending = await Claim.countDocuments({ status: 'submitted' });
        res.status(200).json({ pending });
    } catch (error) {
        console.error('Error retrieving pending claims:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Endpoint to get the total number of claims
const getTotalClaims = async (req, res) => {
    try {
        const total = await Claim.countDocuments();
        res.status(200).json({ total });
    } catch (error) {
        console.error('Error retrieving total claims:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getTotalPolicies, getPendingClaims, getTotalClaims };
