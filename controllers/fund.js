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

const fundTransfer = async (req, res) => {
    try {
        const { amount, userTo, userFrom } = req.body;

        const touser = await User.findOne({ _id: userTo });
        const fromuser = await User.findOne({ _id: userFrom });

        if (!touser) {
            return res.status(404).json({ msg: 'User not found' });
        }
        if (!fromuser) {
            return res.status(404).json({ msg: 'User not found' });
        }
        if (fromuser.wallet.fund < amount) {
            return res.status(400).json({ msg: 'Insufficient funds' });
        }
        fromuser.wallet.fund = fromuser.wallet.fund - parseInt(amount);
        touser.wallet.fund = touser.wallet.fund + parseInt(amount);
        await fromuser.save();
        await touser.save();
        const transaction = new Transaction({
            user: fromuser.id,
            amount,
            flow: 'transfer',
            message: `Transfer to ${touser.name}`
        });
        await transaction.save();
        res.json(fromuser.wallet);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const getTxdHistory = async (req, res) => {
    try {
        const user = await User.findById(req.body.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        const transactions = await Transaction.find({ user: user.id });
        res.json(transactions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};



module.exports = { get_fund, deposit, withdraw, fundTransfer, getTxdHistory };