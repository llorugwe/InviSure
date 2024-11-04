// backend/models/Policy.js
const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
    policyName: String,
    description: String,
    coverageAmount: Number,
    premiumAmount: Number,
    startDate: Date,
    endDate: Date,
    status: {
        type: String,
        enum: ['active', 'expired', 'pending'], // Example: Ensure all possible statuses are here
        default: 'active'
    },
    premium: {
        amount: Number,
        nextDueDate: Date,
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'due'], // Add 'pending' here
            default: 'pending'
        },
        totalPaid: {
            type: Number,
            default: 0
        },
        balanceDue: Number
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    insurancePlanId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InsurancePlan',
        required: true
    },
    // New field for policy type
    insuranceType: {
        type: String,
        enum: ['Health', 'Life', 'Car'], // Define allowed types here
        required: true
    }
});

module.exports = mongoose.model('Policy', policySchema);
