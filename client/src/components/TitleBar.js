import React from 'react';
import VotesRemainingIndicator from './VotesRemainingIndicator';

class TitleBar extends React.Component {
	render() {
		return(
			<div className="row">
				<h2 className="col s6 offset-s3 center-align">Movie Night</h2>
				<VotesRemainingIndicator 
					votesAgainst={this.props.votesAgainst}
					votesFor={this.props.votesFor}
				/>
			</div>
		)
	}
}

export default TitleBar;
