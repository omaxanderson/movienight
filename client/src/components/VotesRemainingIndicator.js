import React from 'react';

class VotesRemainingIndicator extends React.Component {

	render() {
		return (
			<div className="" style={{marginTop: "1.75em", fontFamily: "'Raleway', sans-serif"}}>
				<h4 className="left red-text">
					{this.props.votesRemaining.votesAgainst}/5 
				</h4>
				<h4 className="right cyan-text">
					{this.props.votesRemaining.votesFor}/5 
				</h4>
			</div>
		)
	}

}

export default VotesRemainingIndicator;
