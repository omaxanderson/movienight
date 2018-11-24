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
		//	@TODO add the like and dislike buttons
		//		icons: arrow_upward, arrow_downward, thumb_up, thumb_down
		return(
			<div className="col s3 center-align">
			<div className="card hoverable">
				<div className="card-image">
					<img src={this.props.fullUrl} alt="movie" />
				</div>
				<div className="card-content">
					<div>
						<span className="card-title">
							{this.props.movieName}
						</span>
					</div>
					
				</div>
			</div>
			</div>
		)
	}
}

export default VoteItem;
