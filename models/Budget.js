const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BudgetSchema = new Schema({
    deposit: Number,
    withdrawl: Number,
    balance: Number,
    rci: Number,
    salary: Number,
    level: Number,
    referral: Number,
    purchase: Number,
    total: Number,
    noticeText: String,
    noticeColor: String,
    noticeSwitch: Boolean,
});
module.exports = mongoose.model('Budget', BudgetSchema);