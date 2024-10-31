const express = require('express');
const { getTotalPolicies, getPendingClaims, getTotalClaims } = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Route to get the total number of policies - Restricted to Admin
router.get('/policies/total', authMiddleware('admin'), getTotalPolicies);

// Route to get the count of pending claims - Restricted to Admin
router.get('/claims/pending', authMiddleware('admin'), getPendingClaims);

// Route to get the total number of claims - Restricted to Admin
router.get('/claims/total', authMiddleware('admin'), getTotalClaims);

module.exports = router;
