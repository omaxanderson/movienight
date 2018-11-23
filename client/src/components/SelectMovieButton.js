import React from 'react';

class SelectMovieButton extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			hovering: false
		};

		this.hover = this.hover.bind(this);
	}

	hover() {
		this.setState({hovering: !this.state.hovering});
	}


	render() {
		return(
			<div 
				className={"card col s2 center-align " + (this.state.hovering ? "blue-grey" : "")}
				style={{cursor: "pointer"}}
			>
				<div className="card-image">
					<img 
						style={{paddingTop: ".75em", paddingBottom: ".75em"}}
						key={this.props.src} 
						onClick={this.props.onClick} 
						src={this.props.src} 
						alt="test" 
						onMouseEnter={this.hover}
						onMouseLeave={this.hover}
					/>
				</div>
			</div>
		)
	}
}

export default SelectMovieButton;
