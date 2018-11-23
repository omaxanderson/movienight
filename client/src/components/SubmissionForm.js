import React from 'react';

class SubmissionForm extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			movieName: "",
			searchedMovie: "",
			movieUrls: [],
			movieThumbnails: []
		}

		this.handleMovieChange = this.handleMovieChange.bind(this);
		this.searchMovie = this.searchMovie.bind(this);
		this.selectMovie = this.selectMovie.bind(this);
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

					res.results.items.map((item) => {
						let movieUrls = this.state.movieUrls.slice();
						let movieThumbnails = this.state.movieThumbnails.slice();
						movieUrls.push(item.link);
						movieThumbnails.push(item.image.thumbnailLink);

						// save movie urls, thumbnails, and names
						this.setState({movieUrls: movieUrls, movieThumbnails: movieThumbnails, movieName: ""});
					});
					console.log(this.state.movieUrls);
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
		console.log(this.state.searchedMovie);
		let data = {
			movieName: this.state.searchedMovie,
			movieUrl: event.target.src
		};
		fetch("http://45.79.19.55:8080/api/movie", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(data)
		})
			.then((res) => {
				console.log(res);
				// should probably clear out the searched movies or something
			});
	}

	render() {
		let movies = this.state.movieThumbnails.map((item) => {
			return(<a href="#" key={item} onClick={this.selectMovie}><img height="150px" src={item} alt="test" /></a>)
		});
		return (
			<div>
			<div className="row">
				<form onSubmit={this.searchMovie} className="col s6 offset-s3 center-align">

					<div className="row">
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
			
			<div className="row">
				{movies}
			</div>
			</div>
		)
	}
}

export default SubmissionForm;
