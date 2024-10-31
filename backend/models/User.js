const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['policyholder', 'admin'], default: 'policyholder' },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationTokenExpiry: { type: Date },
    policies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Policy' }], // References to policies
    claims: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Claim' }]     // References to claims
});

// Password hashing before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model('User', userSchema);
