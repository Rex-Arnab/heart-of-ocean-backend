// Create a Transaction Model

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const TxdSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    message: {
        type: String,
        required: true
    },
    flow: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    bank: {
        name: String,
        account: String,
        ifsc: String
    }
});

module.exports = mongoose.model('transaction', TxdSchema);