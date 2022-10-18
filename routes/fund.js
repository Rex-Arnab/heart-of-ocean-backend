// Add a fund route to the router

const express = require('express');
const router = express.Router();

const { get_fund, update_fund } = require('../controllers/fund');

// Get a fund by id
router.get('/', get_fund);

// Update a fund by id
router.post('/', update_fund);

module.exports = router;