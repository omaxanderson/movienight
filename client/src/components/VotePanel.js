import React from 'react';
import VoteLine from './VoteLine';

class VotePanel extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			movies: props.movies
		}
	}

	render() {
		//console.log(this.props.movies);
		let numMovies = this.props.movies ? this.props.movies.length : 0;
		let startIdx = 0;
		let movieGroups = [];
		while (startIdx < numMovies) {
			let arrSlice = [];
			if (startIdx + 4 >= numMovies) {
				arrSlice = this.props.movies.slice(startIdx);
			} else {
				arrSlice = this.props.movies.slice(startIdx, startIdx + 4);
			}
			movieGroups.push(arrSlice);
			startIdx += 4;
		}
		// they're now split into groups of 4s
		let groupNum = 0;
		let movies = movieGroups.map((arr) => {
			return (
				<VoteLine
					movies={arr}
					key={groupNum++}
					vote={this.props.vote}
					votesRemaining={this.props.votesRemaining}
				/>
			)
		});

		if (!movies.length) {
			movies = <p className="grey-text center-align">There are no movies yet, be the first to suggest a movie!</p>;
		}
		return(
			<div className="row">
					{movies}
			</div>
		)
	}
}

export default VotePanel;
