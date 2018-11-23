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
