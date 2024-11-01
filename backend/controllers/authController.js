const User = require('../models/User');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Token generation
const generateVerificationToken = () => crypto.randomBytes(32).toString('hex');

// Configure the email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Send verification email
const sendVerificationEmail = async (email, token) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verify Your InviSure Account',
            text: `Please verify your account by clicking this link: ${process.env.BASE_URL}/auth/verify/${token}`
        };

        console.log(`Sending verification email to ${email}`);
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent successfully');
    } catch (error) {
        console.error('Error sending verification email:', error);
    }
};

// Registration controller
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        console.log('Checking if user already exists...');
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('User already exists');
            return res.status(400).json({ message: 'User already exists' });
        }

        console.log('Generating verification token...');
        const verificationToken = generateVerificationToken();
        const verificationTokenExpiry = Date.now() + 3600000; // 1 hour

        console.log('Creating new user...');
        const user = new User({
            name,
            email,
            password,
            verificationToken,
            verificationTokenExpiry
        });

        console.log('Saving new user to database...');
        await user.save();

        console.log('Sending verification email...');
        await sendVerificationEmail(email, verificationToken);

        res.status(201).json({ message: 'Registration successful. Check your email to verify your account.' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Email verification
const verifyEmail = async (req, res) => {
    const { token } = req.params;

    try {
        console.log(`Verifying token: ${token}`);
        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            console.log('Invalid or expired token');
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        console.log('Token verified, updating user status...');
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiry = undefined;
        await user.save();

        res.status(200).json({ message: 'Account verified successfully' });
    } catch (error) {
        console.error('Error during email verification:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Login controller
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log('Attempting to log in user...');
        const user = await User.findOne({ email });
        if (!user || !user.isVerified) {
            console.log('Invalid credentials or account not verified');
            return res.status(400).json({ message: 'Invalid credentials or account not verified' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Invalid credentials');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const role = user.role === 'user' ? 'policyholder' : user.role; // Convert 'user' to 'policyholder'

        // Generate tokens with role included
        const accessToken = jwt.sign(
            { userId: user._id, role }, // Ensure role is in access token
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );
        const refreshToken = jwt.sign(
            { userId: user._id, role }, // Ensure role is also in refresh token
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        console.log('Login successful');
        res.status(200).json({ accessToken, refreshToken, role });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Password reset request controller
const requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    try {
        console.log(`Requesting password reset for email: ${email}`);
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        const resetToken = generateVerificationToken();
        user.verificationToken = resetToken;
        user.verificationTokenExpiry = Date.now() + 3600000;
        await user.save();

        console.log('Sending password reset email...');
        await sendVerificationEmail(email, resetToken);
        res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
        console.error('Error during password reset request:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Reset password controller
const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        console.log(`Resetting password with token: ${token}`);
        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            console.log('Invalid or expired token');
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.verificationToken = undefined;
        user.verificationTokenExpiry = undefined;
        await user.save();

        console.log('Password reset successful');
        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Refresh access token controller
const refreshAccessToken = async (req, res) => {
    const { token } = req.body; // Expecting the refresh token in the body

    if (!token) {
        console.log('Token is required for refresh');
        return res.status(401).json({ message: 'Token is required' });
    }

    try {
        console.log('Verifying refresh token...');
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

        if (!decoded.role) {
            console.error('Role missing in refresh token payload');
            return res.status(403).json({ message: 'Invalid or expired refresh token' });
        }

        // Generate a new access token
        const newAccessToken = jwt.sign(
            { userId: decoded.userId, role: decoded.role }, // Preserve the role in the payload
            process.env.JWT_SECRET,
            { expiresIn: '15m' } // Shorter lifespan for access token
        );

        console.log('Access token refreshed successfully');
        res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
        console.error('Error during token refresh:', error);
        res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
};

module.exports = { 
    registerUser, 
    verifyEmail, 
    loginUser, 
    requestPasswordReset, 
    resetPassword, 
    refreshAccessToken 
};
