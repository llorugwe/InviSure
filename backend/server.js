// Load environment variables
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // For serving static files

// Import routes
const authRoutes = require('./routes/auth');             // Auth routes
const insurancePlanRoutes = require('./routes/insurancePlans'); // Insurance plan routes
const userRoutes = require('./routes/user');             // User routes for registration, login, and dashboard
const premiumRoutes = require('./routes/premium');       // Premium calculation routes
const claimsRoutes = require('./routes/claims');         // Claims routes for submission, tracking, and admin functions
const adminRoutes = require('./routes/adminRoutes');     // Admin routes for dashboard metrics
const policyRoutes = require('./routes/policies');       // Policies route for retrieving policy details

const app = express();

// Enable CORS for requests from http://localhost:3000
app.use(cors({
    origin: 'http://localhost:3000', // Allow only frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Specify allowed headers
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
app.use('/auth', authRoutes);                     // Authentication routes (register, login)
app.use('/user', userRoutes);                     // User routes (dashboard, account management)
app.use('/insurance-plans', insurancePlanRoutes); // Insurance plans CRUD routes
app.use('/premium', premiumRoutes);               // Premium calculation routes
app.use('/claims', claimsRoutes);                 // Claims submission, tracking, admin routes
app.use('/admin', adminRoutes);                   // Admin metrics routes for dashboard
app.use('/api/policies', policyRoutes);           // Policies route for retrieving policy details

// Handle undefined routes with a 404 response
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
