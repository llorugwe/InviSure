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
        required: true 
    },
    premiumAmount: { 
        type: Number, 
        required: true 
    },
    startDate: Date,  
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

// Static method to get active plans
insurancePlanSchema.statics.getActivePlans = function () {
    return this.find({ status: 'active' });
};

// Instance method to update purchase status
insurancePlanSchema.methods.updatePurchaseStatus = function (userId, isActive) {
    const purchase = this.purchases.find(purchase => purchase.userId.equals(userId));
    if (purchase) {
        purchase.isActive = isActive;
        return this.save();
    }
};

module.exports = mongoose.model('InsurancePlan', insurancePlanSchema);
