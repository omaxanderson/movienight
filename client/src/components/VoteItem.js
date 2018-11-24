import React from 'react';

class VoteItem extends React.Component {

	render() {
		//	@TODO add the delete function
		//		icons: clear, close
		//		keep track of the submission ip, can only delete if from the same ip
		return(
			<div className="col s12 m3 center-align">
			<div className="card hoverable">
				<div className="card-image">
					<img src={this.props.fullUrl} alt="movie" />

					<button onClick={() => this.props.vote(false, this.props.movieName, this.props.movieId)} className="left halfway-fab btn-floating btn waves-effect waves-light red">
						<i className="material-icons">thumb_down</i>
					</button>

					<button onClick={() => this.props.vote(true, this.props.movieName, this.props.movieId)} className="right halfway-fab btn-floating btn waves-effect waves-light cyan lighten-2">
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
							<h5 style={{marginTop: "0px", marginBottom: "0px"}} className="left red-text">- {this.props.votesAgainst}</h5>
							<h5 style={{marginTop: "0px", marginBottom: "0px"}} className="right cyan-text lighten-2">+ {this.props.votesFor}</h5>
						</div>
					</div>
				</div>
			</div>
			</div>
		)
	}
}

export default VoteItem;
