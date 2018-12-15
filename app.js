var createError = require('http-errors');
var session = require('express-session');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ini = require('ini');
var bodyParser = require('body-parser');
const fs = require('fs');
const http = require('http');
const https = require('https');
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');

const config = ini.parse(fs.readFileSync('./environment.ini', 'utf8'));

if (config.env !== 'DEBUG') {
	var privateKey = fs.readFileSync('/etc/letsencrypt/live/yourmovienight.com/privkey.pem', 'utf8');
	//const certificate = fs.readFileSync('/etc/letsencrypt/live/yourmovienight.com/cert.pem', 'utf8');
	var cert = fs.readFileSync('/etc/letsencrypt/live/yourmovienight.com/fullchain.pem', 'utf8');

	var credentials = {
		key: privateKey,
		cert: cert
	};
}

var app = express();

app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.text());

// create different parsers
var jsonParser = bodyParser.json();
var textParser = bodyParser.text();


// set the response headers
app.use((req, res, next) => {
	res.append('Access-Control-Allow-Origin', 'http://localhost:3000');
	res.append('Vary', 'Origin');
	res.append('Access-Control-Allow-Credentials', 'true');
	res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,HEAD,OPTIONS');
	res.append('Access-Control-Allow-Headers', 'Content-Type');

	console.log(req.cookies);

	next();
});

// serve the React front end
app.use(express.static(path.join(__dirname, 'client')));

// set up the api routes
app.use('/user', textParser, userRouter);
app.use('/api', indexRouter);


// set to port 8080 to match proxy route
if (config.env === 'DEBUG') {
	const port = process.env.PORT || '8080';
	app.listen(port);
} else {
	const httpsServer = https.createServer(credentials, app);
	httpsServer.listen(8080, () => {
		console.log('HTTPS server listening on port 8080');
	});
}

module.exports = app;
