var express = require('express');
var router = express.Router();
const config = require('./config');
const fetch = require('node-fetch');
const personalApiKey = require('../apiKey');

// database setup
const dbconfig = require('../dbconfig');
const dbClass = require('./db');
const db = new dbClass();
const mysql = require('mysql');

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
			console.log(rows);
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
			console.log(rows);
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
			`;
			db.query(query)
				.then(rows => {
					res.send(JSON.stringify({status: 200, results: rows}));
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
	console.log(body);
	console.log(req.session);
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
			console.log(rows);
		})
		.catch(err => {
			console.log(err);
		});

});

/* POST a movie to vote on */
router.post('/movie', (req, res) => {
	console.log('\tRequest: ' + req.path);
	console.log(req);
	console.log("HELLOOOOOOOOOOOOOOOOOOOOOO");
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
				console.log(body);

				console.log("MOVIE BEING INSERTED: ");
				console.log(movie);
				// insert the movie into the db
				connection.query(`INSERT INTO movie (movie_name, 
					movie_night_id, 
					thumbnail_url,
					movie_url) VALUES (?, ?, ?, ?)`,
					[movie.movie_name, movie.movie_night_id, movie.thumbnail_url, movie.movie_url],
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

function getCurrentMovieNightId() {
	return new Promise((resolve, reject) => {
		try{ 
			var connection = mysql.createConnection(dbconfig);
			connection.connect();
			connection.query("SELECT MAX(movie_night_id) AS current_night_id FROM movie_night", 
				(err, rows, fields) => {
					if (err) {
						console.log("bummer");
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
