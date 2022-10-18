// Create a basic CRUD API on Router level
const express = require('express');
const router = express.Router();

let users = [];

// get a list of users from array
router.get('/users', (req, res) => {
    res.send(users);
});

// add a new user to array
router.post('/users', (req, res) => {
    users.push(req.body);
    res.send(users);
});

// update a user in array
router.put('/users/:id', (req, res) => {
    users[req.params.id] = req.body;
    res.send(users);
});

// delete a user from array
router.delete('/users/:id', (req, res) => {
    users.splice(req.params.id, 1);
    res.send(users);
});

module.exports = router;