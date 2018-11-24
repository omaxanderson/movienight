import React from 'react';

class SelectMovieButton extends React.Component {

	render() {
		console.log(this.props);
		return(
			<div className="col s12 m2 center-align">
			<div 
				className="card hoverable"
				style={{cursor: "pointer"}}
			>
				<div className="card-image">
					<img 
						key={this.props.src} 
						data-movieurl={this.props.movieUrl}
						onClick={this.props.onClick} 
						src={this.props.src} 
						alt="test" 
					/>
				</div>
			</div>
			</div>
		)
	}
}

export default SelectMovieButton;
