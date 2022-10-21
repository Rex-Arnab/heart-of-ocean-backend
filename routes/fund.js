// Add a fund route to the router

const express = require('express');
const router = express.Router();

const { get_fund, deposit, withdraw } = require('../controllers/fund');

// Get a fund by id
router.get('/', get_fund);

router.post('/deposit', deposit);
router.post('/withdraw', withdraw);

module.exports = router;