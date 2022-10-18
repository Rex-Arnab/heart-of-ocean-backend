// Create a Notice model with title, description, and date

const mongoose = require('mongoose');


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


const NoticeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    settings: {
        bgColor: {
            type: String,
            default: '#fff'
        },
        textColor: {
            type: String,
            default: '#000'
        },
        fontSize: {
            type: String,
            default: '1rem'
        },
        active: {
            type: Boolean,
            default: true
        },
    },
});

module.exports = mongoose.model('Notice', NoticeSchema);