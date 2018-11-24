import React from 'react';
import VoteItem from './VoteItem';

class VoteLine extends React.Component {

	render() {
		console.log(this.props.movies);
		let movies = this.props.movies.map((item) => {
			return (
				<VoteItem
					thumbnailUrl={item.thumbnail_url}
					fullUrl={item.movie_url}
					movieName={item.movie_name}
					votesFor={item.votes_for}
					votesAgainst={item.votes_against}

				/>
			)
		});

		return(
			<div className="row">
				{movies}
			</div>
		)
	}

}

export default VoteLine;
