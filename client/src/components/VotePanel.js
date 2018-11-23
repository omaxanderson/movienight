import React from 'react';

class VotePanel extends React.Component {
	constructor(props) {
		super(props);

		console.log("from VotePanel constructor: " + props.movies.length);
		this.state = {
			movies: props.movies
		}
	}

	render() {
		console.log(this.state.movies.length);
		let movies = this.props.movies.map((item) => {
			return (
				<a href="#" key={item.movie_name}>
					<img height="200px" src={item.thumbnail_url} alt="movie" />
				</a>
			)
		});
		return(
			<div>
				{movies}
			</div>
		)
	}
}

export default VotePanel;
