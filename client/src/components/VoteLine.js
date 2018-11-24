import React from 'react';
import VoteItem from './VoteItem';

class VoteLine extends React.Component {

	render() {
		let movies = this.props.movies.map((item) => {
			return (
				<VoteItem
					thumbnailUrl={item.thumbnail_url}
					fullUrl={item.movie_url}
					movieName={item.movie_name}
					votesFor={item.votes_for}
					votesAgainst={item.votes_against}
					key={item.movie_name}
					vote={this.props.vote}
					movieId={item.movie_id}
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
