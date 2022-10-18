const Transaction = require('../models/Transaction');

// router.get('/', get_all_txd);
// router.get('/:id', get_txd);
// router.put('/:id', update_txd);
// router.delete('/:id', delete_txd);

const get_all_txd = async (_req, res) => {
    try {
        const txd = await Transaction.find({});
        res.json(txd);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

const get_txd = async (req, res) => {
    try {
        const txd = await Transaction.findById(req.params.id);
        if (!txd) {
            return res.status(404).json({ msg: 'Transaction not found' });
        }
        res.json(txd);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

const update_txd = async (req, res) => {
    try {
        const txd = await Transaction.findById(req.params.id);
        if (!txd) {
            return res.status(404).json({ msg: 'Transaction not found' });
        }
        const { message, flow, amount } = req.body;
        txd.message = message;
        txd.flow = flow;
        txd.amount = amount;
        await txd.save();
        res.json(txd);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

const delete_txd = async (req, res) => {
    try {
        const txd = await Transaction.findById(req.params.id);
        if (!txd) {
            return res.status(404).json({ msg: 'Transaction not found' });
        }
        await txd.remove();
        res.json({ msg: 'Transaction removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

module.exports = {
    get_all_txd,
    get_txd,
    update_txd,
    delete_txd
}