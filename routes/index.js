var express = require('express');
var router = express.Router();
const config = require('./config');
const fetch = require('node-fetch');
const personalApiKey = require('../apiKey');
const functions = require('./functions');

// database setup
const dbconfig = require('../dbconfig');
const dbClass = require('./db');
const db = new dbClass();
const mysql = require('mysql');

const NUM_VOTES_ALLOWED = 5;

/* GET user votes */
router.get('/userVotes', (req, res) => {
	functions.userVotesLeft(req)
		.then(result => {
			res.send(JSON.stringify(result));
		})
		.catch(err => {
			res.send(JSON.stringify({status: 500, message: "Internal server error" }));
		});
});

/* GET home page. */
router.get('/', function(req, res) {
	console.log('Request: ' + req.path);
	let response = {
		status: 404,
		message: "Error: please select an api method."
	};
	res.send(JSON.stringify(response));
});

/* GET google image search */
router.get('/movie/:movieName', function(req, res) {
	console.log('Request: ' + req.path);
	let q = encodeURI(req.params.movieName + " movie poster");
	let apiKey = config.apiKey;
	let cx = config.cx;
	let url = "https://www.googleapis.com/customsearch/v1?key=" + apiKey + "&cx=" +
		cx + "&searchType=image&num=5&q=" + q;
	fetch(url)
		.then((res) => {
			return res.json();
		})
		.then((json) => {
			let response = {
				status: 200,
				results: json
			};
			res.send(JSON.stringify(response));
		});
});

/* GET current movie night end date */
router.get('/endDate', (req, res) => {
	console.log('Request: ' + req.path);
	db.fetchOne("SELECT DATE_FORMAT(MAX(end_date), '%Y-%m-%d %H:%I:%s') AS endDate FROM movie_night")
		.then(rows => {
			res.send(JSON.stringify({
				status: 200,
				endDate: rows.endDate
			}));
		})
		.catch(err => {
			console.log('/endDate ERROR:' + err);
			res.send(JSON.stringify({
				status: 500,
				message: "Unable to get vote end date"
			}));
		});
});

/* GET current movie_night_id */
router.get('/movieNightId', (req, res) => {
	console.log('Request: ' + req.path);
	db.fetchOne("SELECT MAX(movie_night_id) AS current_night_id FROM movie_night")
		.then(rows => {
			res.send(JSON.stringify({status: 200, results: rows.current_night_id}));
		})
		.catch(err => {
			res.send(JSON.stringify({
				status: 500,
				message: "Unable to get movie night id"
			}));
		});
});

/* GET current movies in the vote list */
router.get('/movies', (req, res) => {
	console.log('Request: ' + req.path);

	// I'm not sure this is really the best way to get the movie id but oh well
	getCurrentMovieNightId()
		.then(id => {
			let query = `SELECT movie_id, movie_name, thumbnail_url, movie_url,
				SUM(value) AS votes
				FROM movie
					LEFT JOIN movie_vote USING (movie_id)
				WHERE movie_night_id = ${id}
				GROUP BY movie_id
				ORDER BY votes DESC
			`;
			db.query(query)
				.then(rows => {
					// also get the number of votes left
					functions.userVotesLeft(req)
						.then(votes => {
							// we only allow 5 votes each
							let { votes_against, votes_for } = votes;
							votes_against = NUM_VOTES_ALLOWED - votes_against;
							votes_for = NUM_VOTES_ALLOWED - votes_for;
							const result = {
								status: 200,
								results: rows,
								votes: {
									votes_against,
									votes_for
								}
							};
							res.send(JSON.stringify(result));
						})
						.catch(err => {
							res.send(JSON.stringify({status: 500, message: 'Server error: ' + err }));
						});
				})
				.catch(err => {
					res.send(JSON.stringify({status: 500, message: err}));
				});
		});
});

/* POST a new movie vote */
router.post('/newVote', (req, res) => {
	console.log('Request: ' + req.path);
	if (req.body.apiKey !== personalApiKey) {
		res.send(JSON.stringify({
			status: 400,
			message: "invalid api key"
		}));
		return false;
	}

	let sql = `
		INSERT INTO movie_night (end_date)  
		VALUES ((SELECT CONCAT(curdate() + INTERVAL 1 WEEK, " 17:00:00")))
	`;

	// @TODO fix this??
	db.query(sql)
		.then(result => {
			console.log("New movie_night created successfully");
			db.query("SELECT * FROM movie_night WHERE movie_night_id = " + result.insertId)
				.then(rows => {
					res.send(JSON.stringify({
						status: 200,
						data: {
							insertId: rows[0]['movie_night_id'],
							endDate: rows[0]['end_date']
						},
						message: "insert successful"
					}));
				});
		})
		.catch(err => {
			console.log("error occurred on insert: " + err);
			res.send(JSON.stringify({
				status: 500,
				message: "insert unsuccessful"
			}));
		});
});

/* POST vote on a movie */
router.post('/movie/vote/:type', (req, res) => {
	console.log('Request: ' + req.path);
	const body = JSON.parse(req.body);

	// check to make sure they still have any votes remaining
	functions.userVotesLeft(req)
		.then(votes => {
			if ((req.params.type ==='for' && !votes.votes_for) ||
				(req.params.type ==='against' && !votes.votes_against)) {
				res.send(JSON.stringify({status: 400, message: `You have no more ${req.params.type} votes left!`}));
			} else {
				db.query(`INSERT INTO movie_vote (movie_id, user_id, value) VALUES 
						(${parseInt(body.movieId)}, 
							${parseInt(req.session.user)}, 
							${req.params.type === 'for' ? 1 : -1})`)
					.then(rows => {
						if (!rows.affectedRows) {
							res.send(JSON.stringify({ status: 500, message: err }));
						} else {
							res.send(JSON.stringify({ status: 200, message: 'success' }));
						}
					})
					.catch(err => {
						console.log(err);
					});
			}
		})
		.catch(err => {
			res.send(JSON.stringify({status: 500, message: err}));
		});
});

/* POST a movie to vote on */
router.post('/movie', (req, res) => {
	console.log('\tRequest: ' + req.path);
	const body = JSON.parse(req.body);
	var connection = mysql.createConnection(dbconfig);
	connection.connect();

	try {
		getCurrentMovieNightId()
			.then((id) => {
				// create movie obj
				let movie = {
					movie_name: body.movieName,
					movie_night_id: id,
					thumbnail_url: body.movieThumbnail,
					movie_url: body.movieUrl
				};

				console.log(movie);
				// insert the movie into the db
				connection.query(`INSERT INTO movie (movie_name, 
					movie_night_id, 
					thumbnail_url,
					movie_url) VALUES (?, ?, ?, ?)`,
					[movie.movie_name, movie.movie_night_id, movie.thumbnail_url, movie.movie_url],
					(err, rows, fields) => {
						if (err) {
							console.log(err);
						}
						connection.end();

						// send response
						res.send(JSON.stringify({
							status: 200,
							message: "Successfully added movie to list"
						}));
					}
				);
			})
			.catch((err) => {
				console.log(err);
			});
	} catch(err) {
		console.log(err);
	}
});

function userVotesLeft(req, movieNightId) {
	const userId = req.session.user;
	//const movieNightId = session.movieNightId;
	return new Promise((resolve, reject) => {
		const sql = `
			SELECT SUM(value < 0) AS 'votes_against', SUM(value > 0) AS 'votes_for'
			FROM movie
				JOIN movie_vote USING (movie_id)
			WHERE movie_vote.user_id = ${userId}
			AND movie_night_id = ${movieNightId}
		`;

		db.fetchOne(sql)
			.then(rows => {
				resolve(rows);
			})
			.catch(err => {
				reject(err);
			});
	});
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

module.exports = router;
