const express = require('express');
const { calculatePremiumForPlan } = require('../controllers/premiumController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Endpoint for calculating premium based on risk factors
router.post('/calculate', authMiddleware, calculatePremiumForPlan);

module.exports = router;
