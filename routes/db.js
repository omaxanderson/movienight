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
				console.log("ending connection in query");
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
				console.log("ending connection in fetchOne");
				connection.end();
			});
		});
	}
}

module.exports = db;
