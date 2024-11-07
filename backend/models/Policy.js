// models/Policy.js
const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const policySchema = new Schema({
    policyName: { type: String, required: true },
    description: { type: String, required: true },
    coverageAmount: { type: Number, required: true },
    premiumAmount: { 
        type: Number, 
        default: null, 
        required: function() { 
            const isFixed = this.premiumType === 'Fixed';
            console.log(`[DEBUG] Validating premiumAmount. premiumType: ${this.premiumType}, isFixed: ${isFixed}, premiumAmount: ${this.premiumAmount}`);
            return isFixed; 
        } 
    },
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
        amount: {
            type: Number,
            required: function() { 
                const required = this.premiumType === 'Dynamic' || this.premiumAmount !== null;
                console.log(`[DEBUG] Validating premium.amount. premiumType: ${this.premiumType}, premiumAmount: ${this.premiumAmount}, required: ${required}`);
                return required;
            }
        },
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
        balanceDue: {
            type: Number,
            default: 0,
            set: function(value) {
                const calculatedBalance = this.premium.amount ? this.premium.amount - this.premium.totalPaid : value;
                console.log(`[DEBUG] Setting balanceDue. premium.amount: ${this.premium.amount}, totalPaid: ${this.premium.totalPaid}, calculatedBalance: ${calculatedBalance}`);
                return calculatedBalance;
            }
        }
    },
    userId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    insurancePlanId: {
        type: Types.ObjectId,
        ref: 'InsurancePlan',
        required: true
    },
    insuranceType: {
        type: String,
        enum: ['Health', 'Life', 'Car', 'Home', 'Travel'],
        required: true
    }
});

policySchema.statics.findByIdAsObjectId = function (policyId) {
    return this.findById(Types.ObjectId(policyId));
};

const Policy = mongoose.models.Policy || mongoose.model('Policy', policySchema);

module.exports = Policy;
