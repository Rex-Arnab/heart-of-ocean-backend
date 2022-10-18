// Add mongoose user schema and model

const mongoose = require('mongoose');

// User Schema documentation
// User
// 1. name
// 2. email
// 3. password
// 4. date
// 5. createdAt
// 6. updatedAt
// 7. wallet (main, fund)
// 8. status (active)
// 9. role (admin, user)
// 10. referralCode
// 11. parentReferralCode

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
    },
    password: {
        type: String,
        unique: true,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    wallet: {
        main: {
            type: Number,
            default: 0
        },
        fund: {
            type: Number,
            default: 0
        },
    },
    status: {
        active: {
            type: Boolean,
            default: true
        },
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    referralCode: {
        type: String,
        unique: true,
        required: true
    },
    parentReferralCode: {
        type: String,
        required: true
    },
});


module.exports = User = mongoose.model('user', UserSchema);