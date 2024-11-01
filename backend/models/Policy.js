// backend/models/Policy.js
const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    insurancePlanId: {  // Reference to the InsurancePlan model
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InsurancePlan',
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
        enum: ['active', 'pending', 'expired', 'cancelled'],  // Added 'cancelled' status
        default: 'pending'
    },
    cancellationDate: {  // Date of policy cancellation
        type: Date,
        default: null
    },
    premium: {
        amount: {
            type: Number,
            required: true
        },
        nextDueDate: {  // Date for the next premium payment
            type: Date,
            default: null
        },
        paymentStatus: {
            type: String,
            enum: ['paid', 'overdue', 'pending'],
            default: 'pending'
        },
        totalPaid: {
            type: Number,
            default: 0
        },
        balanceDue: {
            type: Number,
            default: 0
        }
    }
}, { timestamps: true });  // Adds createdAt and updatedAt fields

module.exports = mongoose.model('Policy', policySchema);
