const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    policy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Policy',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    amountRequested: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['submitted', 'in review', 'approved', 'rejected'],
        default: 'submitted'
    },
    documents: [{
        type: String   // Stores the path of each uploaded document
    }],
    submittedAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware to update the `updatedAt` field on document update
claimSchema.pre('findOneAndUpdate', function(next) {
    this.set({ updatedAt: Date.now() });
    next();
});

module.exports = mongoose.model('Claim', claimSchema);
