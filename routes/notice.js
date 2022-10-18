// Create a notice route

// Documentation for Notice Schema
//
// title: String
// description: String
// date: Date
// settings: Object
// settings.bgColor: String
// settings.textColor: String
// settings.fontSize: String
// settings.active: Boolean


const express = require('express');
const router = express.Router();

const { get_notice, create_notice, update_notice } = require('../controllers/notice');

router.post('/', create_notice);
router.get('/', get_notice);
router.patch('/', update_notice);

module.exports = router;