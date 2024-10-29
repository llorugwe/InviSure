const express = require('express');
const { getTotalPolicies, getPendingClaims, getTotalClaims } = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Ensure that only admins can access these routes
router.use(authMiddleware);  // Ensure authenticated requests

// Route to get the total number of policies
router.get('/policies/total', getTotalPolicies);

// Route to get the count of pending claims
router.get('/claims/pending', getPendingClaims);

// Route to get the total number of claims
router.get('/claims/total', getTotalClaims);

module.exports = router;
