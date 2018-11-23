var express = require('express');
var router = express.Router();
const config = require('./config');
const fetch = require('node-fetch');
const dbconfig = require('../dbconfig');
var mysql = require('mysql');

/* GET home page. */
router.get('/', function(req, res) {
	let response = {
		status: 404,
		message: "Error: please select an api method."
	};
	res.send(JSON.stringify(response));
});

/* GET google image search */
router.get('/movie/:movieName', function(req, res) {
	let q = encodeURI(req.params.movieName + " movie poster");
	let apiKey = config.apiKey;
	let cx = config.cx;
	//console.log("api key: " + apiKey);
	//console.log("cx: " + cx);
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

/* GET current movie_vote_id */
router.get('/movieVoteId', (req, res) => {
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

/* POST a movie to vote on */
router.post('/movie', (req, res) => {
	// make a db connection
	var connection = mysql.createConnection(dbconfig);
	connection.connect();

	getCurrentMovieVoteId()
		.then((id) => {
			// create movie obj
			let movie = {
				movie_name: req.body.movieName,
				movie_vote_id: id,
				thumbnail_url: req.body.movieUrl,
				movie_url: req.body.movieUrl 	// ehh, let's figure out how to pass both url's in this post
			}

			console.log(movie.movie_vote_id);
			
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
});

function getCurrentMovieVoteId() {
	return new Promise((resolve, reject) => {
		var connection = mysql.createConnection(dbconfig);
		connection.connect();
		connection.query("SELECT MAX(movie_vote_id) AS current_vote_id FROM movie_vote", 
			(err, rows, fields) => {
				if (err) {
					console.log("bummer");
					reject(err);
				}
				connection.end();
				console.log("from helper: " + rows[0].current_vote_id);

				resolve(rows[0].current_vote_id);
			}
		);
	});
}

module.exports = router;
