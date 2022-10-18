const express = require('express');
const router = express.Router();
const Txd = require('../controllers/txd');

const { get_all_txd, get_txd, update_txd, delete_txd } = Txd;

router.get('/', get_all_txd);
router.get('/:id', get_txd);
router.put('/:id', update_txd);
router.delete('/:id', delete_txd);

module.exports = router;