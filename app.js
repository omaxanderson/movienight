var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const router = require('./routes/index');

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// set the response headers
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// serve the React front end
app.use(express.static(path.join(__dirname, 'client')));

// set up the api routes
app.use('/api', router);

// set to port 8080 to match proxy route
const port = process.env.PORT || '8080';
app.listen(port);

module.exports = app;
