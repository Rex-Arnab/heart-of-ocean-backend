// Create a basic CRUD API on Router level
const express = require('express');
const router = express.Router();

// auth routes
router.use('/auth', require('./auth'));

// user routes
router.use('/user', require('./user'));

// fund routes
router.use('/fund', require('./fund'));

// txd routes
router.use('/txd', require('./txd'));

// notice routes
router.use('/notice', require('./notice'));


module.exports = router;