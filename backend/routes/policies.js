// backend/routes/policies.js
const express = require('express');
const router = express.Router();
const { getPolicyDetails } = require('../controllers/policyController');
const authMiddleware = require('../middlewares/authMiddleware');

// GET /api/policies - Retrieve policy details for the authenticated user
router.get('/', authMiddleware, getPolicyDetails);

module.exports = router;
