const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { 
    registerUser, 
    verifyEmail, 
    loginUser, 
    requestPasswordReset, 
    resetPassword, 
    refreshAccessToken 
} = require('../controllers/authController');
const router = express.Router();

// Registration route with email verification
router.post('/register', registerUser);

// Email verification route
router.get('/verify/:token', verifyEmail);

// Login route
router.post('/login', loginUser);

// Request password reset (sends email with token)
router.post('/request-password-reset', requestPasswordReset);

// Reset password using the token provided in email
router.post('/reset-password', resetPassword);

// Refresh token route for generating a new access token
router.post('/refresh-token', refreshAccessToken);

module.exports = router;
