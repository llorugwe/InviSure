// backend/models/Policy.js
const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    policyName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    coverageAmount: {
        type: Number,
        required: true
    },
    premiumAmount: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'pending', 'expired'],
        default: 'pending'
    }
});

module.exports = mongoose.model('Policy', policySchema);
