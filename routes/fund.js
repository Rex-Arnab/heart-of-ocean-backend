// Add a fund route to the router

const express = require('express');
const router = express.Router();

const { get_fund, deposit, withdraw, fundTransfer, getTxdHistory } = require('../controllers/fund');

// Get a fund by id
router.get('/', get_fund);

router.post('/deposit', deposit);
router.post('/withdraw', withdraw);
router.post('/transfer', fundTransfer);
router.post('/history', getTxdHistory);

module.exports = router;