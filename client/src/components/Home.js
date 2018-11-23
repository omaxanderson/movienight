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
	}

	componentDidMount() {
		this.getMovies();
	}

	movieSelected() {
		this.getMovies();
	}

	getMovies() {
		// make the request and get all the current movie data
		fetch("http://45.79.19.55:8080/api/movies")
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				console.log("getting data in Home");
				console.log(data);
				// here's where we populate state with the results
				this.setState({movies: data.results});
			});
	}

	render() {
		console.log("rendering from Home: " + this.state.movies.length);
		return(
			<div>
				<TitleBar/>
				<SubmissionForm 
					movieSelected={this.movieSelected}
				/>
				<VotePanel 
					movies={this.state.movies}
				/>
			</div>
		)
	}
}

export default Home;
