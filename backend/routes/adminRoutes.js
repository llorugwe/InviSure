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

// Ensure only admins can access these routes
router.use(authMiddleware(['admin']));

// Metrics routes
router.get('/policies/total', getTotalPolicies);
router.get('/claims/pending', getPendingClaims);
router.get('/claims/total', getTotalClaims);

// Admin registration route
router.post('/register', registerAdmin);

// Insurance plan management routes
router.post('/create-plan', createInsurancePlan);               // Create a new insurance plan
router.get('/policies', getAvailablePolicies);                  // Retrieve all policies
router.put('/policies/:id', updateInsurancePlan);               // Update an existing insurance plan
router.delete('/policies/:id', deleteInsurancePlan);            // Delete an insurance plan

// User account management routes
router.put('/update-user-status/:userId', updateUserStatus);    // Approve or suspend a user
router.put('/upgrade-to-admin/:userId', upgradeUserToAdmin);    // Upgrade a user to admin

// Claim management routes
router.put('/update-claim-status/:claimId', updateClaimStatus); // Approve or reject a claim
router.get('/all-claims', getAllClaims);                        // Retrieve all claims

module.exports = router;
