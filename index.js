// build a simple express app with mongoose , helmet, cors, morgan, body-parser
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// connect to mongodb
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true }, () => {
    console.log('connected to mongodb');
});

// use helmet
app.use(helmet());

// use cors
app.use(cors());

// use morgan
app.use(morgan('dev'));

// use body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// use routes
app.use('/api', require('./routes/api'));


// start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});