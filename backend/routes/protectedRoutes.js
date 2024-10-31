const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

// Route accessible to any authenticated user
router.get('/general', authMiddleware(), (req, res) => {
    res.json({ message: 'Accessible to any authenticated user' });
});

// Route accessible only to policyholders
router.get('/policyholder-only', authMiddleware('policyholder'), (req, res) => {
    res.json({ message: 'Accessible only to policyholders' });
});

// Route accessible only to admins
router.get('/admin-only', authMiddleware('admin'), (req, res) => {
    res.json({ message: 'Accessible only to admins' });
});

module.exports = router;
