var express = require('express');
var router = express.Router();
const config = require('./config');
const fetch = require('node-fetch');
const dbconfig = require('../dbconfig');
var mysql = require('mysql');
const personalApiKey = require('../apiKey');

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
	fetch(url).then((res) => {
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

/* GET current vote end date */
router.get('/voteEndDate', (req, res) => {
	console.log('Request: ' + req.path);
	var connection = mysql.createConnection(dbconfig);
	connection.connect();
	connection.query("SELECT DATE_FORMAT(MAX(end_date), '%Y-%m-%d %H:%I:%s') AS endDate FROM movie_vote", 
		(err, rows, fields) => {
			if (err) {
				console.log(err);
				res.send(JSON.stringify({
					status: 500,
					message: "Unable to get vote end date"
				}));
			} else {
				res.send(JSON.stringify({
					status: 200,
					endDate: rows[0].endDate
				}));
				console.log(rows[0]);
			}
			connection.end();
		}
	);
});

/* GET current movie_vote_id */
router.get('/movieVoteId', (req, res) => {
	console.log('Request: ' + req.path);
	var connection = mysql.createConnection(dbconfig);
	connection.connect();
	connection.query("SELECT MAX(movie_vote_id) AS current_vote_id FROM movie_vote", 
		(err, rows, fields) => {
			if (err) {
				console.log("bummer");
				throw err;
			}
			res.send(JSON.stringify({status: 200, results: rows[0].current_vote_id}));
		}
	);
	connection.end();
	console.log("ended connection");
});

/* GET current movies in the vote list */
router.get('/movies', (req, res) => {
	console.log('Request: ' + req.path);
	var connection = mysql.createConnection(dbconfig);
	connection.connect();

	// I'm not sure this is really the best way to get the movie id but oh well
	getCurrentMovieVoteId()
		.then((id) => {
			let query = `SELECT movie_id, movie_name, thumbnail_url, movie_url, votes_for, votes_against
				FROM movie
				WHERE movie_vote_id = ` + id
				+ ` ORDER BY votes_for - votes_against DESC`;
			connection.query(query, 
				(err, rows, fields) => {
					// getting close to callback hell
					let response = {
						status: 200,
						results: rows
					}
					res.send(JSON.stringify(response));
					connection.end();
				}
			);
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
	var connection = mysql.createConnection(dbconfig);
	connection.connect();

	let sql = `
		INSERT INTO movie_vote (end_date)  
		VALUES ((SELECT CONCAT(curdate() + INTERVAL 1 WEEK, " 17:00:00")))
	`;

	connection.query(sql, (err, rows, fields) => {
		if (err) {
			console.log("error occurred on insert: " + err);
			res.send(JSON.stringify({
				status: 500,
				message: "insert unsuccessful"
			}));
		} else {
			console.log("New movie_vote created successfully");
			console.log(rows);
			connection.query("SELECT * FROM movie_vote WHERE movie_vote_id = " + rows.insertId,
				(err2, rows2, fields2) => {
					console.log(rows2);
					console.log(err2);
					console.log(fields2);
					res.send(JSON.stringify({
						status: 200,
						data: {
							insertId: rows2[0]['movie_vote_id'],
							endDate: rows2[0]['end_date']
						},
						message: "insert successful"
					}));
					connection.end();
				}
			);
		}
	});
});

/* POST vote on a movie */
router.post('/movie/vote/:type', (req, res) => {
	console.log('Request: ' + req.path);
	var connection = mysql.createConnection(dbconfig);
	connection.connect();

	const body = JSON.parse(req.body);

	// should force integer value ont req.body.movieId
	let sql = "UPDATE movie SET votes_" + req.params.type + " = votes_" + 
		req.params.type + " + 1 WHERE movie_id = " + Number(body.movieId);
	console.log(sql);

	try {
		connection.query(sql, (err, rows, fields) => {
			if (err) {
				console.log(err);
				connection.end();
				res.send(JSON.stringify({
					status: 500,
					message: "Bad request"
				}));
			} else {
				if (rows.affectedRows == 1) {
					// make another query to get the current number?
					connection.query("SELECT votes_" + req.params.type + 
						" AS v FROM movie WHERE movie_id = " 
						+ Number(body.movieId), (err, rows, fields) => {
						if (err) {
							connection.end();
							res.send(JSON.stringify({
								status: 500,
								message: "Bad request"
							}));
						} else {	// only success case?
							res.send(JSON.stringify({
								status: 200,
								message: "Successfully updated",
								currentVotes: rows[0].v
							}));
						}
					});
				} else {
					res.send(JSON.stringify({
						status: 400,
						message: "Update unsuccessful"
					}));
				}
			}
			connection.end();
		});
	} catch (err) {
		console.log(err);
	}
});

/* POST a movie to vote on */
router.post('/movie', (req, res) => {
	console.log('Request: ' + req.path);
	// make a db connection
	var connection = mysql.createConnection(dbconfig);
	connection.connect();

	try {
		getCurrentMovieVoteId()
			.then((id) => {
				// create movie obj
				let movie = {
					movie_name: req.body.movieName,
					movie_vote_id: id,
					thumbnail_url: req.body.movieThumbnail,
					movie_url: req.body.movieUrl
				}
				console.log(req.body);

				console.log("MOVIE BEING INSERTED: ");
				console.log(movie);
				// insert the movie into the db
				connection.query(`INSERT INTO movie (movie_name, 
					movie_vote_id, 
					thumbnail_url,
					movie_url) VALUES (?, ?, ?, ?)`,
					[movie.movie_name, movie.movie_vote_id, movie.thumbnail_url, movie.movie_url],
					(err, rows, fields) => {
						if (err) {
							console.log("gosh darn it that's a bummer");
							console.log("Sending error response");
						}
						connection.end();

						// send response
						console.log("sending success response");
						res.send(JSON.stringify({
							status: 200,
							message: "Successfully added movie to list"
						}));
					}
				);
			})
			.catch((err) => {
				console.log("damn it");
				console.log(err);
			});
	} catch(err) {
		console.log(err);
	}
});

function getCurrentMovieVoteId() {
	return new Promise((resolve, reject) => {
		try{ 
			var connection = mysql.createConnection(dbconfig);
			connection.connect();
			connection.query("SELECT MAX(movie_vote_id) AS current_vote_id FROM movie_vote", 
				(err, rows, fields) => {
					if (err) {
						console.log("bummer");
						reject(err);
					}
					connection.end();

					resolve(rows[0].current_vote_id);
				}
			);
		} catch(err) {
			console.log(err);
		}
	});
}

module.exports = router;
