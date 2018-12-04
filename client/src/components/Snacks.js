import React from 'react';

class Snacks extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			snacks: []
		};
	}

	render() {
		let snacks = this.state.snacks.map((item) => {
		});
		return(
			<div>
				<div className="row">
					<div className="col s6 offset-s3 center-align">
						<h2>Snacks</h2>
					</div>
				</div>
				
			</div>
		);
	}
}

export default Snacks;
