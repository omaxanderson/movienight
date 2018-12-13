var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fs = require('fs');
const http = require('http');
const https = require('https');
const router = require('./routes/index');

const privateKey = fs.readFileSync('/etc/letsencrypt/live/yourmovienight.com/privkey.pem', 'utf8');
//const certificate = fs.readFileSync('/etc/letsencrypt/live/yourmovienight.com/cert.pem', 'utf8');
const cert = fs.readFileSync('/etc/letsencrypt/live/yourmovienight.com/fullchain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: cert
};

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
//const port = process.env.PORT || '8080';
//app.listen(port);
//

// @TODO I think what I need to do is serve the react app on a different port,
// 	somehow configure 443 incoming requests to proxy to that port, and do
// 	some other fucking magic

// or i just need to make this a real fucking site instead of this garbage piece
// of shit
const httpsServer = https.createServer(credentials, app);
httpsServer.listen(8080, () => {
	console.log('HTTPS server listening on port 8080');
});

module.exports = app;
