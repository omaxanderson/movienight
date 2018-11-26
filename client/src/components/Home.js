import React from 'react';
import TitleBar from './TitleBar';
import SubmissionForm from './SubmissionForm';
import VotePanel from './VotePanel';
var dateFormat = require('dateformat');

class Home extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			data: "",
			movies: [],
			votesRemaining: {}
		}

		// if the localStorage object hasn't been set yet, do that now
		// @TODO figure out how to reset when a new week has been started
		// 	- maybe store the end date and compare it to current date
		if (!localStorage.getItem("votesRemaining")) {
			console.log("setting votesRemaining");
			localStorage.setItem("votesRemaining", JSON.stringify({
				votesFor: 5,
				votesAgainst: 5
			}));
		}

		let endDate = localStorage.getItem("voteEndDate")
		let d = new Date();
		let currentDate = dateFormat(d, "yyyy-mm-dd HH:MM:ss");

		// lil message for Jon
		console.log("Alright Jon, you're the only one who would look here so I know it's gotta be you. If you feel like cheating the system either just use an incognito browser or take a look at the localStorage data...");

		// basically reset the vote stuff if the saved date is in the past
		// aka they haven't viewed the page since the last movie night
		if (!endDate || currentDate > endDate) {
			// if localStorage.voteEndDate in the past, reset
			localStorage.setItem("votesRemaining", JSON.stringify({
				votesFor: 5,
				votesAgainst: 5
			}));
			// make a request to set the next end date
			fetch("http://45.79.19.55:8080/api/voteEndDate")
				.then((res) => {
					return res.json();
				})
				.then((data) => {
					// here's where we populate state with the results
					localStorage.setItem("voteEndDate", data.endDate);
				})
				.catch((err) => {
					alert("Uh oh, no response from the server so this site isn't going to work right now. Way to go Max.")
				});
		}

		this.movieSelected = this.movieSelected.bind(this);
		this.vote = this.vote.bind(this);
	}

	componentDidMount() {
		this.setState({votesRemaining: JSON.parse(localStorage.getItem("votesRemaining"))});
		this.getMovies();
	}

	movieSelected() {
		this.getMovies();
	}

	// @TODO the localstorage logic isn't quite right
	// 	if they upvote once, a downvote will simply bring it back to 
	// 	how it was instead of going -1
	// what we're actually going to do is give each person 5 upvotes and 
	// 5 downvotes, non-refundable
	vote(isUpvote, movieName, movieId) {
		/*
		if (localStorage.getItem(movieId) === (isUpvote ? "for" : "against")) {
			alert("Woah there pal, you can't vote for the same thing twice...");
			return false;
		}
		*/
		let votesRemaining = JSON.parse(localStorage.getItem("votesRemaining"));
		if (isUpvote && !votesRemaining.votesFor) {
			alert("Woah there you don't have any more Thumbs Ups left");
			return false;
		}
		if (!isUpvote && !votesRemaining.votesAgainst) {
			alert("Woah there you don't have any more Thumbs Downs left");
			return false;
		}
		console.log((isUpvote ? "upvote" : "downvote") + " for " + movieName + ": " + movieId);
		// lets make a post request
		let url = "http://45.79.19.55:8080/api/movie/vote/" + (isUpvote ? "for" : "against");
		console.log(url);
		fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				movieId: movieId,
			})
		})
		.then((res) => {
			return res.json();
		})
		.then((data) => {
			let movies = this.state.movies.slice();
			for (let i = 0; i < movies.length; i++) {
				if (movies[i].movie_id === movieId) {
					isUpvote ? movies[i].votes_for++ : movies[i].votes_against++;
				}
			}
			this.setState({movies: movies});
			if (isUpvote) {
				votesRemaining.votesFor--;
			} else {
				votesRemaining.votesAgainst--;
			}

			localStorage.setItem("votesRemaining", JSON.stringify(votesRemaining));
			this.setState({votesRemaining: votesRemaining});
			// add the vote to the localStorage
			// this localstorage is kinda hacky but it works well enough
			//localStorage.setItem(movieId, (isUpvote ? "for" : "against"));
		})
		.catch((err) => {
			alert("Sorry, an error occurred on the server. Please try again later.");
		});
	}

	getMovies() {
		// make the request and get all the current movie data
		fetch("http://45.79.19.55:8080/api/movies")
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				// here's where we populate state with the results
				this.setState({movies: data.results});
				//console.log(this.state.movies);
			})
			.catch((err) => {
				alert("Uh oh, no response from the server so this site isn't going to work right now. Way to go Max.")
			});
	}

	// @TODO fix the indicator -- it's not updating on the first vote
	render() {
		return(
			<div>
				<TitleBar
					votesRemaining={this.state.votesRemaining}
				/>
				<VotePanel 
					movies={this.state.movies}
					vote={this.vote}
				/>
				<SubmissionForm 
					movieSelected={this.movieSelected}
				/>
			</div>
		)
	}
}

export default Home;
