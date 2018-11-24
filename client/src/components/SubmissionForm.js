import React from 'react';
import SelectMovieButton from './SelectMovieButton';

class SubmissionForm extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			movieName: "",
			searchedMovie: "",
			movieUrls: [],
			movieThumbnails: [],
			movies: []
		}

		this.handleMovieChange = this.handleMovieChange.bind(this);
		this.searchMovie = this.searchMovie.bind(this);
		this.selectMovie = this.selectMovie.bind(this);
		this.clearState = this.clearState.bind(this);
	}

	clearState() {
		this.setState({movieName: "", searchedMovie: "", movieUrls: [], movieThumbnails: [], movies: []});
	}

	searchMovie(event) {
		event.preventDefault();
		this.setState({movieUrls: [], movieThumbnails: []});
		// make the api request to add a movie to the vote list
		fetch("http://45.79.19.55:8080/api/movie/" + this.state.movieName)
			.then((res) => {
				return res.json();
			})
			.then((res) => {
				if (res.status === 200) {
					// save movie name for when they click on a movie
					let searchedMovie = this.state.movieName;
					this.setState({searchedMovie: searchedMovie});

					let movies = res.results.items.map((item) => {
						return {movieUrl: item.link, thumbnailLink: item.image.thumbnailLink};
					});

					this.setState({movies: movies, movieName: ""});
				} else {
					console.log("An error occurred");
				}
			});
	}

	handleMovieChange(event) {
		this.setState({movieName: event.target.value});
	}

	selectMovie(event) {
		event.preventDefault();
		// send the api request to save the event.target.src attribute
		let data = {
			movieName: this.state.searchedMovie,
			movieUrl: event.target.dataset.movieurl,
			movieThumbnail: event.target.src
		};
		console.log(event.target);
		console.log(event.target.dataset.movieurl);
		fetch("http://45.79.19.55:8080/api/movie", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(data)
		})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				this.clearState();
				this.props.movieSelected();
			});
	}

	render() {
		// change from movieUrls -> movieThumbnails for higher res images
		//console.log(this.state.movies);
		let movies = this.state.movies.map((item) => {
			// these should be their own components
			//return(<button key={item} onClick={this.selectMovie}><img height="150px" src={item} alt="test" /></button>)
			return <SelectMovieButton
						onClick={this.selectMovie}
						src={item.thumbnailLink}
						movieUrl={item.movieUrl}
						key={item.thumbnailUrl}
					/>;
		});
		return (
			<div>
			<div className="row">
				<div className="col s12 m12">
					<div className="card ">
						<div className="card-content">
						<div className="row" style={{marginBottom: "0px", marginTop: "1em"}}>
						<form onSubmit={this.searchMovie} className="col s12 center-align">

							<div className="row" style={{marginBottom: "0px"}}>
								<div className="input-field col s8" style={{ marginTop: "0px" }}>
									<input 
										id="movieName" 
										type="text" 
										value={this.state.movieName} 
										onChange={ this.handleMovieChange } 
									/>
									<label htmlFor="movieName">Enter a movie into the vote!</label>
								</div>
								<div className="col s4">
									<button className="btn waves-effect waves-light" type="submit" name="action">Submit
										<i className="material-icons right">send</i>
									</button>
								</div>
							</div>
						</form>
						</div>

						<div className="row" style={{marginBottom: "0px"}}>
							<div className="valign-wrapper">
								{movies}
							</div>
						</div>

						</div>
					</div>
				</div>
			</div>
			
			</div>
		)
	}
}

export default SubmissionForm;
