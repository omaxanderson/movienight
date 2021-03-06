import React from 'react';

class VoteItem extends React.Component {

	render() {
		//let score = Math.abs(this.props.votesFor - this.props.votesAgainst);
		let score = this.props.votes || 0;
		let scoreCol = "";
		if (score > 0) {
			scoreCol = " cyan-text ";
			score = "+ " + score;
		} else if (score < 0) {
			scoreCol = " red-text ";
			score = "- " + Math.abs(score);
		} else {
			scoreCol = "";
		}
		//	@TODO add the delete function
		//		icons: clear, close
		return(
			<div className="col s12 m3 center-align">
			<div className="card hoverable">
				<div className="card-image">
					<img src={this.props.fullUrl} alt="movie" />

					<button 
						onClick={() => this.props.vote(false, this.props.movieName, this.props.movieId)} 
						disabled={!this.props.votesRemaining.votes_against}
						className="left hide-on-small-only show-on-medium-and-up halfway-fab btn-floating btn waves-effect waves-light red">
						<i className="material-icons">thumb_down</i>
					</button>

					<button 
						onClick={() => this.props.vote(true, this.props.movieName, this.props.movieId)} 
						disabled={!this.props.votesRemaining.votes_for}
						className="right hide-on-small-only show-on-medium-and-up halfway-fab btn-floating btn waves-effect waves-light cyan lighten-2">
						<i className="material-icons">thumb_up</i>
					</button>
				
					<button 
						onClick={() => this.props.vote(false, this.props.movieName, this.props.movieId)} 
						disabled={!this.props.votesRemaining.votes_against}
						className="left show-on-small hide-on-med-and-up halfway-fab btn-floating btn-large waves-effect waves-light red">
						<i className="material-icons">thumb_down</i>
					</button>

					<button 
						onClick={() => this.props.vote(true, this.props.movieName, this.props.movieId)} 
						disabled={!this.props.votesRemaining.votes_for}
						className="right show-on-small hide-on-med-and-up halfway-fab btn-floating btn-large waves-effect waves-light cyan lighten-2">
						<i className="material-icons">thumb_up</i>
					</button>
				</div>
				<div className="card-content">
					<div>
						<span className="card-title">
							{
								this.props.movieName
									.toLowerCase()
									.split(' ')
									.map((s) => s.charAt(0).toUpperCase() + s.substring(1))
									.join(' ')
							}
						</span>
					</div>
					<div className="row" style={{marginBottom: "0px"}}>
						<div className="col s12">
							<h5 
								style={{marginTop: "0px", marginBottom: "0px"}} 
								className={"center-align" + scoreCol}>
								{score}
							</h5>
						</div>
					</div>
				</div>
			</div>
			</div>
		)
	}
}

export default VoteItem;
