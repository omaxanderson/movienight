import React from 'react';
import VotesRemainingIndicator from './VotesRemainingIndicator';

class TitleBar extends React.Component {
	render() {
		return(
			<div className="row">
				<h2 className="col s6 offset-s3 center-align">Movie Night</h2>
				<VotesRemainingIndicator 
					votesRemaining={this.props.votesRemaining}
				/>
			</div>
		)
	}
}

export default TitleBar;
