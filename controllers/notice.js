// Notice controller to handle CRUD operation on a single notice document

const Notice = require('../models/Notice');

// Get a notice by id
exports.get_notice = (_req, res) => {
    Notice.findOne({})
        .then(notice => res.json(notice))
        .catch(() =>
            res.status(404).json({ nonoticefound: 'No notice found with that ID' })
        );
}

// Update a notice by id
exports.update_notice = (req, res) => {
    Notice.findOneAndUpdate({}, req.body)
        .then(() => res.json({ msg: 'Updated successfully' }))
        .catch(() =>
            res.status(400).json({ error: 'Unable to update the Database' })
        );
}


// Create a notice by id
exports.create_notice = (req, res) => {
    const newNotice = new Notice(req.body);
    newNotice.save()
        .then(() => res.json({ msg: 'Notice created successfully' }))
        .catch(() => res.status(400).json({ error: 'Unable to create notice' }));
}