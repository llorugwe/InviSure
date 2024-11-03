const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    insurancePlanId: { type: mongoose.Schema.Types.ObjectId, ref: 'InsurancePlan', required: true },
    policyName: { type: String, required: true },
    description: String,
    coverageAmount: Number,
    startDate: Date,
    endDate: Date,
    status: { type: String, enum: ['active', 'pending', 'expired'], default: 'active' },
    premium: {
        amount: Number,
        paymentStatus: { type: String, enum: ['paid', 'due', 'overdue'], default: 'due' },
        totalPaid: { type: Number, default: 0 },
        balanceDue: Number,
        nextDueDate: Date
    }
});

module.exports = mongoose.model('Policy', policySchema);
