import React from 'react';

class VotesRemainingIndicator extends React.Component {

	render() {
		console.log("rendering indicator");
		console.log(this.props.votesRemaining);
		return (
			<div className="row right" style={{marginTop: "1.75em"}}>
				<h4 className="red-text">
					{this.props.votesRemaining.votesAgainst}/5 
				</h4>
				<h4 className="cyan-text">
					{this.props.votesRemaining.votesFor}/5 
				</h4>
			</div>
		)
	}

}

export default VotesRemainingIndicator;
