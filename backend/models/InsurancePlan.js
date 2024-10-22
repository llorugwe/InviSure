const mongoose = require('mongoose');

const insurancePlanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    premium: {
        type: Number,
        required: true
    },
    coverage: {
        type: String,
        required: true
    },
    riskFactors: {
        type: [String],  // Array of strings representing risk factors
        required: true
    }
});

module.exports = mongoose.model('InsurancePlan', insurancePlanSchema);
