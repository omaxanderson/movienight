var express = require('express');
var router = express.Router();
var config = require('./config');
const fetch = require('node-fetch');

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
	console.log("api key: " + apiKey);
	console.log("cx: " + cx);
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

/* POST a movie to vote on */
router.post('/movie', (req, res) => {
	console.log(req.body.movieName);
	console.log(req.body.movieUrl);
});

module.exports = router;
