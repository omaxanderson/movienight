const dbconfig = require('./migrationDbConfig');
var mysql = require('mysql');
var path = require('path');

if (process.argv[2] === 'up') {
	up();
} else if (process.argv[2] === 'down') {
	down();
}

function up() {
	var connection = mysql.createConnection(dbconfig);
	connection.connect();

	let sql = `
		CREATE TABLE movie_night_user (
			movie_night_id INT,
			user_id INT,
			PRIMARY KEY (movie_night_id, user_id)
		)
	`;

	connection.query(sql, (err, rows, fields) => {
		if (err) {
			console.log(err);
		} else {
			console.log(path.basename(__filename) + " up ran successfully");
		}
		connection.end();
	});
}

function down() {
	var connection = mysql.createConnection(dbconfig);
	connection.connect();
	let sql = `
		DROP TABLE movie_night_user
	`;

	connection.query(sql, (err, rows, fields) => {
		if (err) {
			console.log(err);
		} else {
			console.log(path.basename(__filename) + " down ran successfully");
		}
		connection.end();
	});
}

