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

const update_fund = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.id });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        const { amount, flow } = req.body;
        if (flow === 'deposit') {
            user.wallet.fund += amount;
        }
        if (flow === 'withdraw') {
            if (user.wallet.fund < amount) {
                return res.status(400).json({ msg: 'Insufficient fund' });
            }
            user.wallet.fund -= amount;
        }
        await user.save();
        const newTxd = new Transaction({
            user: user.id,
            message: `Fund ${flow}`,
            flow,
            amount,
        });
        await newTxd.save();
        res.json(user.wallet);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = { get_fund, update_fund };