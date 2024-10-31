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
const adminRoutes = require('./routes/adminRoutes');     // New admin routes for dashboard metrics

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

// Log the JWT_SECRET for verification
console.log("JWT_SECRET from env:", process.env.JWT_SECRET);
console.log("MONGO_URL from env:", process.env.MONGO_URL);  // Check MongoDB URL for connection issues

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Define routes
app.use('/auth', authRoutes);                   // Authentication routes (register, login)
app.use('/user', userRoutes);                   // User routes (dashboard, account management)
app.use('/insurance-plans', insurancePlanRoutes); // Insurance plans CRUD routes
app.use('/premium', premiumRoutes);             // Premium calculation routes
app.use('/claims', claimsRoutes);               // Claims submission, tracking, admin routes
app.use('/admin', adminRoutes);                 // New admin metrics routes for dashboard

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
