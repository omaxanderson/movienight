const apiKey = require('../apiKey');

// make POST request to the backend
fetch("http://45.79.19.55:8080/api/newMovieVote", {
	method: "POST",
	body: {
		apiKey: apiKey
	}
)
	.then((res) => {
		return res.json();
	})
	.then((data) => {
		console.log(data);
	});
