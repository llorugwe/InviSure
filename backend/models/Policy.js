// backend/models/Policy.js
const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
    policyName: { type: String, required: true },
    description: { type: String, required: true },
    coverageAmount: { type: Number, required: true },
    
    // Only applicable if `premiumType` is "Fixed"; otherwise, it should be null
    premiumAmount: { 
        type: Number, 
        default: null, 
        required: function() { return this.premiumType === 'Fixed'; } 
    },

    // Specifies if the premium calculation is "Fixed" or "Dynamic"
    premiumType: { 
        type: String, 
        enum: ['Fixed', 'Dynamic'], 
        required: true 
    },

    startDate: Date,
    endDate: Date,

    status: {
        type: String,
        enum: ['active', 'expired', 'pending'],
        default: 'active'
    },

    premium: {
        amount: Number,
        nextDueDate: Date,
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'due'],
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

    // Specifies the type of insurance (e.g., Health, Life, Car, etc.)
    insuranceType: {
        type: String,
        enum: ['Health', 'Life', 'Car', 'Home', 'Travel'],
        required: true
    }
});

module.exports = mongoose.model('Policy', policySchema);
