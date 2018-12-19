var mysql = require('mysql');
const personalApiKey = require('../apiKey');
const dbconfig = require('../dbconfig');

class db {

	query(sql) {
		return new Promise((resolve, reject) => {
			var connection = mysql.createConnection(dbconfig);
			connection.connect();

			connection.query(sql, (err, rows, fields) => {
				if (err) {
					reject(err);
				} else {
					resolve(rows);
				}
				connection.end();
			});
		});
	}

	fetchOne(sql) {
		return new Promise((resolve, reject) => {
			var connection = mysql.createConnection(dbconfig);
			connection.connect();

			connection.query(sql, (err, rows, fields) => {
				if (err) {
					reject(err);
				} else {
					resolve(rows[0]);
				}
				connection.end();
			});
		});
	}
}

module.exports = db;
