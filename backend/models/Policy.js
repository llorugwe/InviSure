const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    basePremium: { type: Number, required: true },
    riskFactors: { type: Array, default: [] }, // Additional risk factors for premium calculation
    customOptions: { type: Map, of: String }   // User customization options, e.g., coverage level
});

module.exports = mongoose.model('Policy', policySchema);
