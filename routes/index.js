var express = require('express');
var router = express.Router();
var config = require('./config');
const fetch = require('node-fetch');

/* GET home page. */
router.get('/', function(req, res) {
  res.send("Error: please select an api method");
});

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
		res.send(json);
	});
});


module.exports = router;
