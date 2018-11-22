var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

console.log(path.join(__dirname, 'client'));
app.use(express.static(path.join(__dirname, 'client')));

app.get('/api/helloworld', (req, res) => {
	res.send("Hello World!");
});

const port = process.env.PORT || '8080';
app.listen(port);

module.exports = app;
