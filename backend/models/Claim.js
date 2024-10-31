const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    policyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InsurancePlan',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['submitted', 'in review', 'approved', 'rejected'],
        default: 'submitted'
    },
    submissionDate: {
        type: Date,
        default: Date.now
    },
    resolutionDate: {
        type: Date
    },
    notes: {
        type: String
    }
});

module.exports = mongoose.model('Claim', claimSchema);
