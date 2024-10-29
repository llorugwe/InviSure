const User = require('../models/User');
const Policy = require('../models/Policy');
const Claim = require('../models/Claim');

// User Dashboard: Get user policies, premium, and claim history
const getUserDashboard = async (req, res) => {
    try {
        const userId = req.user.userId; // Assuming JWT middleware has added userId to req
        const user = await User.findById(userId).populate('policies claims');
        
        res.status(200).json({
            policies: user.policies,
            claims: user.claims,
        });
    } catch (error) {
        console.error('Error fetching user dashboard:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getUserDashboard };