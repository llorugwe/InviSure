const mongoose = require('mongoose');

const insurancePlanSchema = new mongoose.Schema({
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
        required: true,
        min: [0, 'Coverage amount must be a positive number']
    },
    premiumAmount: { 
        type: Number, 
        min: [0, 'Premium amount must be a positive number'],
        // This should be conditionally set based on `premiumType`
    },
    premiumType: { 
        type: String, 
        enum: ['Fixed', 'Dynamic'], 
        required: true 
    },
    startDate: { 
        type: Date, 
        default: Date.now  
    },
    endDate: Date,
    status: {
        type: String,
        enum: ['active', 'pending', 'expired'],
        default: 'active'
    },
    paymentOptions: {
        type: [String],
        enum: ['monthly', 'quarterly', 'yearly'],
        default: ['monthly']
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    insuranceType: { 
        type: String, 
        required: true,
        enum: ['Health', 'Life', 'Car', 'Home', 'Travel']
    },
    purchases: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        purchaseDate: {
            type: Date,
            default: Date.now
        },
        coverageStartDate: Date,
        coverageEndDate: Date,
        isActive: {
            type: Boolean,
            default: true
        }
    }]
});

// Static methods for retrieving active and available plans
insurancePlanSchema.statics.getActivePlans = function () {
    return this.find({ status: 'active' });
};

insurancePlanSchema.statics.getAvailablePolicies = function () {
    return this.find({ isAvailable: true }).select(
        'policyName description premiumAmount premiumType coverageAmount insuranceType isAvailable'
    );
};

// Instance method to update purchase status for a specific user
insurancePlanSchema.methods.updatePurchaseStatus = function (userId, isActive) {
    const purchase = this.purchases.find(purchase => purchase.userId.equals(userId));
    if (purchase) {
        purchase.isActive = isActive;
        return this.save();
    }
};

// Static methods for CRUD operations
insurancePlanSchema.statics.createPlan = function (planData) {
    const plan = new this(planData);
    return plan.save();
};

insurancePlanSchema.statics.updatePlan = function (planId, updateData) {
    return this.findByIdAndUpdate(planId, updateData, { new: true });
};

insurancePlanSchema.statics.deletePlan = function (planId) {
    return this.findByIdAndDelete(planId);
};

module.exports = mongoose.model('InsurancePlan', insurancePlanSchema);
