const mongoose = require('mongoose');

const insurancePlanSchema = new mongoose.Schema({
    policyName: String,
    description: String,
    coverageAmount: Number,
    startDate: Date,
    endDate: Date,
    status: {
        type: String,
        enum: ['active', 'pending', 'expired'],
    },
    premium: {
        amount: Number,
        dueDate: Date,
        paymentStatus: {
            type: String,
            enum: ['paid', 'overdue', 'pending'],
        },
        totalPaid: Number,
        balanceDue: Number,
    }
});

module.exports = mongoose.model('InsurancePlan', insurancePlanSchema);
