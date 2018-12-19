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

	let sql = [`DROP TABLE IF EXISTS movie_vote`,
		`CREATE TABLE movie_vote (
			movie_vote_id INT PRIMARY KEY AUTO_INCREMENT,
			movie_id INT NOT NULL,
			user_id INT NOT NULL,
			INDEX movie_id (movie_id, user_id)
		)`
	];

	sql.forEach(q => {
		connection.query(q, (err, rows, fields) => {
			if (err) {
				console.log(err);
			} else {
				console.log(path.basename(__filename) + " up ran successfully");
			}
		});
	});
	connection.end();
}

function down() {
	var connection = mysql.createConnection(dbconfig);
	connection.connect();
	let sql = `
		ALTER TABLE movie_vote
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

