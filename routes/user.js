var express = require('express');
var router = express.Router();
const dbconfig = require('../dbconfig');
var mysql = require('mysql');
const bcrypt = require('bcryptjs');
const uniqid = require('uniqid');
const md5 = require('md5');

router.get('/', (req, res) => {
	console.log('hit it');
});

router.get('/logout', (req, res) => {
	console.log('logging out');
	res.clearCookie('userCookie');
	res.clearCookie('loginCookie');

	// invalidate the login token

	// destroy the session
	req.session.destroy();

	// redirect to login
	res.send(JSON.stringify({status: 'success', message: 'Logged out'}));
});

router.post('/login', (req, res) => {
	// load password hash from db
	var connection = mysql.createConnection(dbconfig);
	connection.connect();
	const params = JSON.parse(req.body);
	
	// kinda hacky for now, but uncomment to get the hash for a password
	// console.log(bcrypt.hashSync(params.password));

	const sql = `SELECT user_id, password 
		FROM user
		WHERE username = '${params.username}'`;

	connection.query(sql, (err, rows, fields) => {
		if (err) {
			console.log(err);
			res.send(JSON.stringify({status: 'error', message: 'Internal server error'}));
		} else if (rows.length === 0) {
			res.send(JSON.stringify({status: 'error', message: 'Username not found'}));
		} else if (!bcrypt.compareSync(params.password, rows[0]['password'])) {
			res.send(JSON.stringify({status: 'error', message: 'Incorrect password'}));
		} else {
			// we're good, generate the cookie
			const cookie = md5(params.username + Date.now());
			const userId = rows[0].user_id;
			
			// save the cookie to the db
			const insertSql = `REPLACE INTO session_cookie 
				(user_id, cookie) VALUES (${userId}, '${cookie}')`;

			connection.query(insertSql, (err, rows, fields) => {
				console.log(rows.affectedRows);
				if (err) {
					// do some error handling
					console.log(err);
				} else if ([1,2].includes(rows.affectedRows)) {
					// 1 if just insert, 2 if replacement
					// set the session user
					req.session.user = userId;
					// set that cookie!
					console.log('success!');
					res.cookie('loginCookie', cookie, {
						maxAge: 1000 * 60 * 60 * 24 * 7 * 2, // 2 weeks
						httpOnly: true,
						resave: true,
						saveUninitialized: true
					});
					res.send(JSON.stringify({status: 'success'}));
				} else {
					// something bad happened :(
					res.send(JSON.stringify({status: 'error'}));
				}
				// we need to close that shit
				connection.close();
			});
		}
	});
});

module.exports = router;
