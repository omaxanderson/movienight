const mysql = require('mysql');
const dbconfig = require('../dbconfig');
const dbClass = require('./db');
const db = new dbClass();

const NUM_VOTES_ALLOWED = 5;

function userVotesLeft(req) {
	const userId = req.session.user;
	//const movieNightId = session.movieNightId;
	return new Promise((resolve, reject) => {
		getCurrentMovieNightId()
			.then(id => {
				const sql = `
					SELECT IF(SUM(value < 0) IS NOT NULL, SUM(value < 0), 0) AS 'votes_against', 
						IF(SUM(value > 0) IS NOT NULL, SUM(value > 0), 0) AS 'votes_for'
					FROM movie
						JOIN movie_vote USING (movie_id)
					WHERE movie_vote.user_id = ${userId}
					AND movie_night_id = ${id}
				`;

				db.fetchOne(sql)
					.then(rows => {
						// we should do the change here
						let { votes_against, votes_for } = rows;
						votes_against = NUM_VOTES_ALLOWED - votes_against;
						votes_for = NUM_VOTES_ALLOWED - votes_for;
						resolve({votes_against, votes_for});
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
