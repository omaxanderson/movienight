import React from 'react';

class SubmissionForm extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			movieName: "",
			movieUrls: [],
			movieThumbnails: []
		}

		this.handleMovieChange = this.handleMovieChange.bind(this);
		this.searchMovie = this.searchMovie.bind(this);
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
				res.items.map((item) => {
					let movieUrls = this.state.movieUrls.slice();
					let movieThumbnails = this.state.movieThumbnails.slice();
					movieUrls.push(item.link);
					movieThumbnails.push(item.image.thumbnailLink);
					this.setState({movieUrls: movieUrls, movieThumbnails: movieThumbnails, movieName: ""});
				});
				console.log(this.state.movieUrls);
			});
	}

	handleMovieChange(event) {
		this.setState({movieName: event.target.value});
	}

	render() {
		let movies = this.state.movieThumbnails.map((item) => {
			return(<img height="150px" src={item} key={item} alt="test" />)
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
