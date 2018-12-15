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

	let sql = `INSERT INTO user (username, password, group_id)
	VALUES ('erikpeterson', '$2a$10$76tBhhG7OfDQP/OW7l4ObenlAmcbOCqPyaK7/70j4REsaICcwOtcm', 2),
	('davebodger', '$2a$10$9E1kzIKfgcPHPEg6fWID/ecldcfK3ysbxxtAcbtZsEaJr0/DCAYPe', 2),
	('wyattrichard', '$2a$10$G8D/cWCpXZDXIMKxoeYNbuUIPGCXi.l702tkaVLZDFcBoZe.YO6Um', 2),
	('brandonstark', '$2a$10$q5CW2Wwh1HamrU.IBMnNzOQh0VIIMOnk/yWg3eJmkx/DB5V0jaDli', 2),
	('jennavenem', '$2a$10$TKWY6e0ee7oe.DGzbNAF/OfJY8MrGDpGGTZng9sy9TbJBergmQFEW', 2),
	('hannahjohnson', '$2a$10$0g0k/3IPYzsF4N8objWMw.FNl82zfDdwnwLlSUd/aXUikFfa6W7Ta', 2),
	('bridgethills', '$2a$10$/9tVhsN/mIVU5GhSdnx4aO/WHJtMlqIw.9altZwkdZ/muIYRrgXCi', 2),
	('maiajohnson', '$2a$10$B82vpG75Qn0t/hftzeANSOCODW15.U7ViKn4dng3dRAp74bsANOUS', 2),
	('roseabdo', '$2a$10$PqKNMHY0h1YZpChBqDQWceuloeytheM67qdz2VqpDbl/.tjOfAXhe', 2),
	('erikafinanger', '$2a$10$CBrQ529tQkKbSezBkf22Xef.FAfIqSdjnkzbaM4xZeTnRuYfxnCnW', 2),
	('sydneyenzler', '$2a$10$CjHufJxO2fiJM4sWrkivzOtkrhb1CB9qJ0rehiX9bv7wIfCEIMTsi', 2),
	('jonopdahl', '$2a$10$QeZdwIb114/ZcflVUfMOWeczp7XjZipFUWkeUFMzsJiujeifovYje', 2),
	('alibelzer', '$2a$10$nA8M.C96aSSQw1KpSx7LG.I7wnaGvuyp6I5I5VvAc/EMaO40djTte', 2),
	('ryangebhart', '$2a$10$IiY6TUaOkMSvyCGr/z4QJesuaoxoIsFUu4Lc85J7vfDApjZXbnJjq', 2),
	('kirstenbrenden', '$2a$10$c1m8ZSUM659VjPTTPb1RDeHKIpW5G6y6nGBLWsSSkpT/Vpzkf7nMq', 2)
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
	let sql = `DELETE FROM user
		WHERE username IN ('erikpeterson','davebodger','wyattrichard','brandonstark',
			'jennavenem','hannahjohnson','bridgethills','maiajohnson','roseabdo',
			'erikafinanger','sydneyenzler','jonopdahl','alibelzer','ryangebhart','kirstenbrenden') 
		LIMIT 15`;

	connection.query(sql, (err, rows, fields) => {
		if (err) {
			console.log(err);
		} else {
			console.log(path.basename(__filename) + " down ran successfully");
		}
		connection.end();
	});
}

