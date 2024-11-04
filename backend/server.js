// backend/server.js
// Load environment variables
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // For serving static files

// Import routes
const authRoutes = require('./routes/auth');
const insurancePlanRoutes = require('./routes/insurancePlans');
const userRoutes = require('./routes/user');
const premiumRoutes = require('./routes/premium');
const paymentsRoutes = require('./routes/payments'); // Payments route
const claimsRoutes = require('./routes/claims');
const adminRoutes = require('./routes/adminRoutes');
const policyRoutes = require('./routes/policies'); // Policy details route
const insuranceMetadataRoutes = require('./routes/insuranceMetadata'); // Metadata route
const premiumCalculatorRoutes = require('./routes/premiumCalculator'); // Premium calculation route

const app = express();

// Enable CORS for requests from http://localhost:3000
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware to parse JSON requests
app.use(express.json());

// Serve uploaded files statically from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Log environment variables for verification
console.log("Environment variables loaded:");
console.log(" - JWT_SECRET:", process.env.JWT_SECRET ? "Loaded" : "Not loaded");
console.log(" - MONGO_URL:", process.env.MONGO_URL ? "Loaded" : "Not loaded");

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Define routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/insurance-plans', insurancePlanRoutes);
app.use('/premium', premiumRoutes);              // Premium route
app.use('/payments', paymentsRoutes);            // Payments route
app.use('/claims', claimsRoutes);
app.use('/admin', adminRoutes);
app.use('/api/policies', policyRoutes);          // Policies route
app.use('/api/insurance-metadata', insuranceMetadataRoutes); // Insurance metadata route
app.use('/api/premium', premiumCalculatorRoutes); // Premium calculator route

// Handle undefined routes with a 404 response
app.use((req, res) => {
    console.log(`404 Error: Route ${req.method} ${req.originalUrl} not found`); // Log undefined routes
    res.status(404).json({ message: 'Route not found' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
