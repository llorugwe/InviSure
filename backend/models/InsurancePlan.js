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
        required: true,
        min: [0, 'Premium amount must be a positive number']
    },
    startDate: { 
        type: Date, 
        default: Date.now  // Optional: defaults to current date if not provided
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
    // Array to store references to User purchases
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

// Static method to get active plans (for admin and user retrieval)
insurancePlanSchema.statics.getActivePlans = function () {
    return this.find({ status: 'active' });
};

// Static method to get available plans for public access
insurancePlanSchema.statics.getAvailablePolicies = function () {
    return this.find({ isAvailable: true }).select(
        'policyName description premiumAmount coverageAmount isAvailable'
    );
};

// Instance method to update the purchase status of a specific user's plan
insurancePlanSchema.methods.updatePurchaseStatus = function (userId, isActive) {
    const purchase = this.purchases.find(purchase => purchase.userId.equals(userId));
    if (purchase) {
        purchase.isActive = isActive;
        return this.save();
    }
};

// Static method for creating a new insurance plan (for admin functionality)
insurancePlanSchema.statics.createPlan = function (planData) {
    const plan = new this(planData);
    return plan.save();
};

// Static method for updating an existing insurance plan (for admin functionality)
insurancePlanSchema.statics.updatePlan = function (planId, updateData) {
    return this.findByIdAndUpdate(planId, updateData, { new: true });
};

// Static method for deleting an insurance plan (for admin functionality)
insurancePlanSchema.statics.deletePlan = function (planId) {
    return this.findByIdAndDelete(planId);
};

module.exports = mongoose.model('InsurancePlan', insurancePlanSchema);
