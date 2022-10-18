// Create a basic CRUD API on Router level
const express = require('express');
const router = express.Router();

// auth routes
router.use('/auth', require('./auth'));

// user routes
router.use('/user', require('./user'));

// notice routes
router.use('/notice', require('./notice'));


module.exports = router;