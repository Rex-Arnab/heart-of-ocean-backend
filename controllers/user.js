const User = require('../models/User');

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