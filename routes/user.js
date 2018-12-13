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

	const sql = `SELECT password 
		FROM user
		WHERE username = '${req.body.username}'`;

	connection.query(sql, (err, rows, fields) => {
		if (err) {
			console.log(err);
			res.send(JSON.stringify({status: 'error'}));
		} else if (bcrypt.compareSync(req.body.password, rows[0]['password'])) {
			//console.log(rows[0]['password']);
			res.send(JSON.stringify({status: 'success'}));
		}
	});
});

module.exports = router;
