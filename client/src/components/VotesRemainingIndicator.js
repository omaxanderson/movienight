import React from 'react';

class VotesRemainingIndicator extends React.Component {

	render() {
		console.log("rendering indicator");
		var votesRemaining = JSON.parse(localStorage.getItem("votesRemaining"));
		return (
			<div className="row right" style={{marginTop: "1.75em"}}>
				<h4 className="red-text">
					{votesRemaining.votesAgainst}/5 
				</h4>
				<h4 className="cyan-text">
					{votesRemaining.votesFor}/5 
				</h4>
			</div>
		)
	}

}

export default VotesRemainingIndicator;
