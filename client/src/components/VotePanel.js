import React from 'react';

class VotePanel extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			movies: props.movies
		}
	}

	render() {
		let movies = this.props.movies.map((item) => {
			return (
				<a href="#" key={item.movie_name}>
					<img height="200px" src={item.thumbnail_url} alt="movie" />
				</a>
			)
		});
		if (!movies.length) {
			movies = <p className="grey-text center-align">There are no movies yet, be the first to suggest a movie!</p>;
		}
		return(
			<div>
				{movies}
			</div>
		)
	}
}

export default VotePanel;
