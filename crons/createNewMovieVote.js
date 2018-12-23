const apiKey = require('../apiKey');
const dbClass = require('../routes/db');
const db = new dbClass();

db.query(`
		INSERT INTO movie_night (end_date)  
		VALUES ((SELECT CONCAT(curdate() + INTERVAL 1 WEEK, " 17:00:00")))
	`)
	.then(result => {
		console.log('successfully created new movie night');
	})
	.catch(err => {
		console.log(err);
	});
