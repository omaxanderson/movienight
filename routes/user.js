var express = require('express');
var router = express.Router();
const dbconfig = require('../dbconfig');
var mysql = require('mysql');
const bcrypt = require('bcryptjs');

router.get('/', (req, res) => {
	console.log('hit it');
});

router.post('/login', (req, res) => {
	// load password hash from db
	var connection = mysql.createConnection(dbconfig);
	connection.connect();
	const params = JSON.parse(req.body);
	console.log(req.session);

	const sql = `SELECT password 
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
			
			// save the cookie to the db
			
			// set that cookie!
			res.send(JSON.stringify({status: 'success'}));
		}
	});
});

module.exports = router;
