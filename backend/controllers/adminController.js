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

// Admin registration function
const registerAdmin = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new admin user
        const newAdmin = new User({
            name,
            email,
            password: hashedPassword,
            role: 'admin'  // Set the role as 'admin' explicitly
        });

        // Save the new admin to the database
        await newAdmin.save();

        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        console.error('Error during admin registration:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin function to create a new insurance plan
const createInsurancePlan = async (req, res) => {
    const { policyName, description, premiumAmount, coverageAmount, riskFactors, isAvailable } = req.body;
    
    // Log the received data
    console.log('Received data in createInsurancePlan:', req.body);

    // Basic validation
    if (!policyName || !description || !premiumAmount || !coverageAmount) {
        console.error('Missing required fields:', { policyName, description, premiumAmount, coverageAmount });
        return res.status(400).json({ message: 'All required fields must be provided' });
    }

    try {
        const newPlan = new InsurancePlan({
            policyName,
            description,
            premiumAmount,
            coverageAmount,
            riskFactors,
            isAvailable: isAvailable ?? true
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
    const { status } = req.body; // status can be 'approved' or 'suspended'

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

// Admin function to approve or reject a claim
const updateClaimStatus = async (req, res) => {
    const { claimId } = req.params;
    const { status } = req.body; // status can be 'approved' or 'rejected'

    try {
        const claim = await Claim.findByIdAndUpdate(claimId, { status }, { new: true });
        if (!claim) return res.status(404).json({ message: 'Claim not found' });
        res.status(200).json({ message: `Claim status updated to ${status}`, claim });
    } catch (error) {
        console.error('Error updating claim status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin function to retrieve all claims in the system
const getAllClaims = async (req, res) => {
    try {
        const claims = await Claim.find();
        res.status(200).json(claims);
    } catch (error) {
        console.error('Error retrieving all claims:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin function to retrieve all insurance policies
const getAllPolicies = async (req, res) => {
    try {
        const policies = await InsurancePlan.find(); // Retrieve all policies
        res.status(200).json(policies); // Send the policies in the response
    } catch (error) {
        console.error('Error retrieving policies:', error);
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
    getAllPolicies // Add this line to export the function
};