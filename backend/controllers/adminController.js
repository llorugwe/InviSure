const Policy = require('../models/Policy');
const Claim = require('../models/Claim');
const User = require('../models/User');
const InsurancePlan = require('../models/InsurancePlan');
const bcrypt = require('bcrypt');

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

// Admin function to register a new admin
const registerAdmin = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = new User({
            name,
            email,
            password: hashedPassword,
            role: 'admin'
        });

        await newAdmin.save();
        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        console.error('Error during admin registration:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin function to create a new insurance plan
const createInsurancePlan = async (req, res) => {
    const { policyName, description, premiumType, premiumAmount, coverageAmount, riskFactors, isAvailable, insuranceType } = req.body;
    
    console.log('Received data in createInsurancePlan:', req.body);

    if (!policyName || !description || !premiumType || !coverageAmount || !insuranceType) {
        console.error('Missing required fields:', { policyName, description, premiumType, coverageAmount, insuranceType });
        return res.status(400).json({ message: 'All required fields must be provided' });
    }

    try {
        const newPlan = new InsurancePlan({
            policyName,
            description,
            premiumType,
            premiumAmount: premiumType === 'Fixed' ? premiumAmount : null,
            coverageAmount,
            riskFactors,
            isAvailable: isAvailable ?? true,
            insuranceType
        });
        await newPlan.save();
        res.status(201).json({ message: 'Insurance plan created successfully', newPlan });
    } catch (error) {
        console.error('Error creating insurance plan:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin function to update an existing insurance plan
const updateInsurancePlan = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const updatedPlan = await InsurancePlan.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedPlan) return res.status(404).json({ message: 'Insurance plan not found' });
        res.status(200).json({ message: 'Insurance plan updated successfully', updatedPlan });
    } catch (error) {
        console.error('Error updating insurance plan:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin function to delete an insurance plan
const deleteInsurancePlan = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedPlan = await InsurancePlan.findByIdAndDelete(id);
        if (!deletedPlan) return res.status(404).json({ message: 'Insurance plan not found' });
        res.status(200).json({ message: 'Insurance plan deleted successfully' });
    } catch (error) {
        console.error('Error deleting insurance plan:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin function to update user status (e.g., approve or suspend user)
const updateUserStatus = async (req, res) => {
    const { userId } = req.params;
    const { status } = req.body;

    try {
        const user = await User.findByIdAndUpdate(userId, { status }, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: `User status updated to ${status}`, user });
    } catch (error) {
        console.error('Error updating user status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin function to upgrade a user to an admin role
const upgradeUserToAdmin = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findByIdAndUpdate(userId, { role: 'admin' }, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User upgraded to admin successfully', user });
    } catch (error) {
        console.error('Error upgrading user to admin:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin function to update claim status with extended options
const updateClaimStatus = async (req, res) => {
    const { claimId } = req.params;
    const { status } = req.body;

    const validStatuses = ['submitted', 'in review', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
    }

    try {
        const updatedClaim = await Claim.findByIdAndUpdate(claimId, { status }, { new: true });
        if (!updatedClaim) return res.status(404).json({ message: 'Claim not found' });
        res.status(200).json({ message: 'Claim status updated successfully', claim: updatedClaim });
    } catch (error) {
        console.error('Error updating claim status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin function to retrieve all claims with user and policy details
const getAllClaims = async (req, res) => {
    try {
        const claims = await Claim.find()
            .populate({ path: 'userId', select: 'name email' }) // Populate userId
            .populate({ path: 'policyId', select: 'policyName basePremium' }) // Populate policyId
            .sort({ submittedAt: -1 });
        
        res.status(200).json(claims);
    } catch (err) {
        console.error('Error retrieving all claims:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Admin function to retrieve all available insurance policies
const getAvailablePolicies = async (req, res) => {
    try {
        const policies = await InsurancePlan.find({ status: 'active', isAvailable: true }).select(
            'policyName description premiumAmount coverageAmount'
        );
        res.status(200).json(policies);
    } catch (error) {
        console.error('Error retrieving available policies:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { 
    getTotalPolicies, 
    getPendingClaims, 
    getTotalClaims, 
    registerAdmin, 
    createInsurancePlan, 
    updateInsurancePlan, 
    deleteInsurancePlan, 
    updateUserStatus, 
    upgradeUserToAdmin, 
    updateClaimStatus, 
    getAllClaims, 
    getAvailablePolicies
};
