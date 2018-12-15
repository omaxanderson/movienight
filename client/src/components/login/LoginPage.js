import React from 'react';
import url from '../url';
var browserCookies = require('browser-cookies');

class LoginPage extends React.Component {

	login(event) {
		event.preventDefault();
		const username = document.querySelector('#username').value;
		const password = document.querySelector('#password').value;
		if (!username) {
			alert("username missing");
		}
		if (!password) {
			alert("password missing");
		}
		console.log('logging in...');
		// send this username and password to the api, redirect if success, show error if not
		fetch(url + '/user/login', {
			method: 'POST',
			headers: {
				"Content-Type": "text/plain"
			},
			credentials: 'include',
			body: JSON.stringify({username, password})
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				if (data['status'] === 'success') {
					//window.location.href= '/';
					// set the cookie
					// wait first we have to get cookie...
				} else {
					console.log('error logging in');
				}
			});

	}

	// good god i need to learn how to make proper react components
	render() {
		return (
			<div>
				<h2 className="center-align">Login</h2>
				<div className="row" style={{marginTop: "2.5em"}}>
					<div className="col s12 m6 offset-m3">
						<div className="card blue-grey lighten-5">
							<div className="card-content">
								<form onSubmit={this.login}>
									<div className="row" style={{marginBottom: "0px"}}>
										<div className="input-field col s12" style={{ marginTop: "0px" }}>
											<input 
												id="username" 
												type="text" 
												autoFocus
											/>
											<label htmlFor="username">Username</label>
										</div>

										<div className="input-field col s12" style={{ marginTop: "0px" }}>
											<input 
												id="password" 
												type="password" 
											/>
											<label htmlFor="password">Password</label>
										</div>
										<div className="col s4">
											<button className="btn waves-effect waves-light" type="submit" name="action">Log In
												<i className="material-icons right">send</i>
											</button>
										</div>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default LoginPage;
