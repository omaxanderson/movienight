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
