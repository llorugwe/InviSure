const express = require('express');
const { submitClaim, getUserClaims, getAllClaims, updateClaimStatus } = require('../controllers/claimController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Route for submitting a claim (user only)
router.post('/', authMiddleware, submitClaim);

// Route for retrieving all claims of the logged-in user
router.get('/', authMiddleware, getUserClaims);

// Admin routes for viewing all claims and updating claim status
router.get('/all', authMiddleware, getAllClaims);
router.put('/:claimId/status', authMiddleware, updateClaimStatus);

module.exports = router;
