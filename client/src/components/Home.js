import React from 'react';
import TitleBar from './TitleBar';
import SubmissionForm from './SubmissionForm';

class Home extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			data: ""
		}
	}

	componentDidMount() {
		// this.makeBackendRequest();
	}

	makeBackendRequest() {
		fetch('http://45.79.19.55:8080/api')
			.then((data) => {
				return data.text();
			})
			.then((res) => {
				console.log(res);
				this.setState({ data: res });
			});
	}

	render() {
		return(
			<div>
				<TitleBar/>
				<SubmissionForm />
				<div>
					{this.state.data}
				</div>
			</div>
		)
	}
}

export default Home;
