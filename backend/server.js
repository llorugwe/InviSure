require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth'); // Existing auth routes
const insurancePlanRoutes = require('./routes/insurancePlans'); // Existing insurance plan routes
const userRoutes = require('./routes/user'); // Add the user routes for registration and login

const app = express();
app.use(express.json()); // Middleware to parse JSON requests

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/auth', authRoutes); // Auth routes
app.use('/user', userRoutes); // User routes for registration and login
app.use('/insurance-plans', insurancePlanRoutes); // Insurance plan routes

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
