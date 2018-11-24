import React from 'react';
import TitleBar from './TitleBar';
import SubmissionForm from './SubmissionForm';
import VotePanel from './VotePanel';

class Home extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			data: "",
			movies: []
		}
		this.movieSelected = this.movieSelected.bind(this);
		this.vote = this.vote.bind(this);
	}

	componentDidMount() {
		this.getMovies();
	}

	movieSelected() {
		this.getMovies();
	}

	vote(isUpvote, movieName, movieId) {
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

	render() {
		return(
			<div>
				<TitleBar/>
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
