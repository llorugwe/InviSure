const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const policySchema = new Schema({
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

    // Reference to the user who purchased this policy
    userId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Reference to the related insurance plan
    insurancePlanId: {
        type: Types.ObjectId,
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

// Helper function to query by ObjectId type in other parts of the code
policySchema.statics.findByIdAsObjectId = function (policyId) {
    return this.findById(Types.ObjectId(policyId));
};

// Check if the Policy model already exists before defining it again
const Policy = mongoose.models.Policy || mongoose.model('Policy', policySchema);

module.exports = Policy;
