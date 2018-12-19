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
		ALTER TABLE movie_night
		CHANGE movie_vote_id movie_night_id INT NOT NULL AUTO_INCREMENT
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
		ALTER TABLE movie_night
		CHANGE movie_night_id movie_vote_id INT NOT NULL AUTO_INCREMENT
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

