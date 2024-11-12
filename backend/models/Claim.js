const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  policyId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Policy', 
      required: true 
  },
  userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
  },
  description: { 
      type: String, 
      required: true 
  }, // Details about the claim
  amount: { 
      type: Number, 
      required: true 
  }, // Amount claimed by the policyholder
  status: { 
      type: String, 
      enum: ['submitted', 'in review', 'approved', 'rejected'], // Extended status options
      default: 'submitted' 
  },
  submittedAt: { 
      type: Date, 
      default: Date.now 
  },
  updatedAt: { 
      type: Date, 
      default: Date.now 
  }
});

// Middleware to update updatedAt field on save
claimSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Middleware to update updatedAt field on update
claimSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

module.exports = mongoose.model('Claim', claimSchema);