const User = require('../models/User');
const Transaction = require('../models/Transaction');

// Get all users
exports.get_all_users = (_req, res) => {
    User.find()
        .select('-password')
        .then(users => res.json(users))
        .catch(() => res.status(404).json({ nousersfound: 'No users found' }));
}

// Get a user by id
exports.get_user = (req, res) => {
    User.findById(req.params.userId)
        .select('-password')
        .then(user => res.json(user))
        .catch(() =>
            res.status(404).json({ nouserfound: 'No user found with that ID' })
        );
}

// Update a user by id
exports.update_user = (req, res) => {
    User.findByIdAndUpdate(req.params.userId, req.body)
        .then(() => res.json({ msg: 'Updated successfully' }))
        .catch(() =>
            res.status(400).json({ error: 'Unable to update the Database' })
        );
}

// Delete a user by id
exports.delete_user = (req, res) => {
    User.findByIdAndRemove(req.params.userId, req.body)
        .then(() => res.json({ mgs: 'User entry deleted successfully' }))
        .catch(() => res.status(404).json({ error: 'No such a user' }));
}

// Get all users
exports.get_all_user_list = (_req, res) => {
    User.find({}, { _id: 1, name: 1 })
        .then(users => res.json(users))
        .catch(() => res.status(404).json({ nousersfound: 'No users found' }));
}

// Activate a user by id
exports.user_activation = async (req, res) => {
    const user = await User.findById(req.body.id);
    if (!user) {
        return res.status(404).json({ nouserfound: 'No user found with that ID' });
    }

    if (user.wallet.fund < 100) {
        return res.status(400).json({ error: 'Insufficient fund' });
    }
    user.status.active = true;
    user.wallet.fund -= 100;
    // Add a transaction for user activation

    const newTxd = new Transaction({
        user: req.body.id,
        message: 'User activation',
        flow: 'activation',
        amount: 100,
    });

    await user.save()
    await newTxd.save()

    res.json({ msg: 'User activated successfully' });
}