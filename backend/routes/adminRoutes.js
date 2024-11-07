const express = require('express');
const { 
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
} = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Apply admin authorization to all routes within this router
router.use(authMiddleware(['admin']));

// Metrics routes
router.get('/policies/total', getTotalPolicies);      // Get the total number of policies
router.get('/claims/pending', getPendingClaims);      // Get the number of pending claims
router.get('/claims/total', getTotalClaims);          // Get the total number of claims

// Admin registration route
router.post('/register', registerAdmin);              // Register a new admin

// Insurance plan management routes
router.post('/create-plan', createInsurancePlan);     // Create a new insurance plan
router.get('/policies', getAvailablePolicies);        // Retrieve all available policies
router.put('/policies/:id', updateInsurancePlan);     // Update an existing insurance plan by ID
router.delete('/policies/:id', deleteInsurancePlan);  // Delete an insurance plan by ID

// User account management routes
router.put('/update-user-status/:userId', updateUserStatus);   // Approve or suspend a user by ID
router.put('/upgrade-to-admin/:userId', upgradeUserToAdmin);   // Upgrade a user to admin by ID

// Claim management routes
router.put('/update-claim-status/:claimId', updateClaimStatus); // Update claim status with extended options
router.get('/all-claims', getAllClaims);                        // Retrieve all claims with user and policy details

module.exports = router;
