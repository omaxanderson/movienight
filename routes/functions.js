const mysql = require('mysql');
const dbconfig = require('../dbconfig');
const dbClass = require('./db');
const db = new dbClass();

function userVotesLeft(req) {
	const userId = req.session.user;
	//const movieNightId = session.movieNightId;
	return new Promise((resolve, reject) => {
		getCurrentMovieNightId()
			.then(id => {
				const sql = `
					SELECT SUM(value < 0) AS 'votes_against', SUM(value > 0) AS 'votes_for'
					FROM movie
						JOIN movie_vote USING (movie_id)
					WHERE movie_vote.user_id = ${userId}
					AND movie_night_id = ${id}
				`;

				db.fetchOne(sql)
					.then(rows => {
						resolve(rows);
					})
					.catch(err => {
						reject(err);
					});
			})
			.catch(err => {
				console.log(err);
				reject(err);
			});
	})
}

function getCurrentMovieNightId() {
	return new Promise((resolve, reject) => {
		try{ 
			var connection = mysql.createConnection(dbconfig);
			connection.connect();
			connection.query("SELECT MAX(movie_night_id) AS current_night_id FROM movie_night", 
				(err, rows, fields) => {
					if (err) {
						reject(err);
					}
					connection.end();

					resolve(rows[0].current_night_id);
				}
			);
		} catch(err) {
			console.log(err);
			reject(err);
		}
	});
}

module.exports = {
	getCurrentMovieNightId,
	userVotesLeft
}
