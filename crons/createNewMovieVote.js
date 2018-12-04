const apiKey = require('../apiKey');
const fetch = require('node-fetch');

// make POST request to the backend
fetch("http://45.79.19.55:8080/api/newVote", {
	method: "POST",
	headers: {
		"Content-Type": "application/json"
	},
	body: JSON.stringify({
		apiKey: apiKey
	})
})
	.then((res) => {
		return res.json();
	})
	.then((data) => {
		console.log(data);
	})
	.catch((err) => {
		console.log(err);
	});
