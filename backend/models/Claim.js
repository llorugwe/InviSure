const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
    policyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Policy', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, required: true }, // Details about the claim
    status: { type: String, enum: ['submitted', 'approved', 'rejected'], default: 'submitted' },
    submittedAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

module.exports = mongoose.model('Claim', claimSchema);
