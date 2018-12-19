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

	let sql = `ALTER TABLE movie 
		DROP COLUMN votes_for, 
		DROP COLUMN votes_against,
		CHANGE movie_vote_id movie_night_id INT`;


	connection.query(sql, (err, rows, fields) => {
		if (err) {
			console.log(err);
		} else {
			console.log(path.basename(__filename) + " up ran successfully");
		}
	});

	connection.end();
}

function down() {
	var connection = mysql.createConnection(dbconfig);
	connection.connect();
	let sql = `ALTER TABLE movie 
		ADD COLUMN votes_for INT NULL DEFAULT 0, 
		ADD COLUMN votes_against INT NULL DEFAULT 0,
		CHANGE movie_night_id movie_vote_id INT`;

	connection.query(sql, (err, rows, fields) => {
		if (err) {
			console.log(err);
		} else {
			console.log(path.basename(__filename) + " down ran successfully");
		}
	});

	connection.end();
}

