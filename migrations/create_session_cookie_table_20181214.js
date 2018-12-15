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

	let sql = `CREATE TABLE session_cookie (
		session_cookie_id INT PRIMARY KEY AUTO_INCREMENT,
		user_id INT NOT NULL,
		cookie VARCHAR(100) NOT NULL,
		UNIQUE INDEX \`cookie\` (cookie),
		UNIQUE INDEX \`user_id\` (user_id)
	)`;

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
	let sql = `DROP TABLE session_cookie`;

	connection.query(sql, (err, rows, fields) => {
		if (err) {
			console.log(err);
		} else {
			console.log(path.basename(__filename) + " down ran successfully");
		}
		connection.end();
	});
}

