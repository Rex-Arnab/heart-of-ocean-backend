// fund controller with widthdraw and deposit methods
const User = require('../models/User');
const Transaction = require('../models/Transaction');

const get_fund = async (req, res) => {
    try {
        const user = await User.findById(req.user.id || req.body.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user.wallet);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const deposit = async (req, res) => {
    try {
        const { id, amount, bank } = req.body;
        console.log(req.body)
        const user = await User.findOne({ _id: id });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        user.wallet.fund += parseInt(amount);
        await user.save();
        const transaction = new Transaction({
            user: user.id,
            amount,
            flow: 'deposit',
            message: `Deposit to ${user.name}`,
            bank
        });
        await transaction.save();
        res.json(user.wallet);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const withdraw = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        const { amount } = req.body;
        if (user.wallet < amount) {
            return res.status(400).json({ msg: 'Insufficient funds' });
        }
        user.wallet = user.wallet - amount;
        await user.save();
        const transaction = new Transaction({
            user: user.id,
            amount,
            type: 'withdraw'
        });
        await transaction.save();
        res.json(user.wallet);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = { get_fund, deposit, withdraw };