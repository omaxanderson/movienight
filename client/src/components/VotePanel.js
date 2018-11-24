import React from 'react';
import VoteItem from './VoteItem';
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
		let numMovies = this.props.movies.length;
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
		let movies = movieGroups.map((arr) => {
			return (
				<VoteLine
					movies={arr}
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
