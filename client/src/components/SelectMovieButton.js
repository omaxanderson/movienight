import React from 'react';

class SelectMovieButton extends React.Component {

	render() {
		return(
			<button key={this.props.src} onClick={this.props.onClick}>
				<img height="150px" src={this.props.src} alt="test" />
			</button>
		)
	}
}

export default SelectMovieButton;
