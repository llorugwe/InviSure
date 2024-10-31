// backend/controllers/policyController.js
const Policy = require('../models/Policy');

// Function to get policy details for the authenticated user
const getPolicyDetails = async (req, res) => {
    try {
        // Find policies associated with the authenticated user
        const policies = await Policy.find({ userId: req.user.userId });

        // Return policies if found
        res.status(200).json(policies);
    } catch (error) {
        console.error('Error retrieving policy details:', error);
        res.status(500).json({ message: 'Error retrieving policy details', error: error.message });
    }
};

module.exports = { getPolicyDetails };
