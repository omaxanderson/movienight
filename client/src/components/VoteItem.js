import React from 'react';

class VoteItem extends React.Component {

	render() {
		/*
		return(
			<a href="#" key={this.props.thumbnailUrl}>
				<img height="200px" src={this.props.thumbnailUrl} alt="movie" />
			</a>
			// should be made up of maybe a card with the image and two buttons
		)
		*/
//		console.log(this.props);
		//	@TODO add the delete function
		//		icons: clear, close
		//		keep track of the submission ip, can only delete if from the same ip
		//	@TODO add the like and dislike buttons
		//		icons: arrow_upward, arrow_downward, thumb_up, thumb_down
		return(
			<div className="col s3 center-align">
			<div className="card hoverable">
				<div className="card-image">
					<img src={this.props.fullUrl} alt="movie" />

					<a className="left halfway-fab btn-floating btn waves-effect waves-light red">
						<i className="material-icons">thumb_down</i>
					</a>

					<a className="right halfway-fab btn-floating btn waves-effect waves-light cyan lighten-2">
						<i className="material-icons">thumb_up</i>
					</a>
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
