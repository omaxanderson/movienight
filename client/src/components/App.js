import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './Home';
import Snacks from './Snacks';
import LoginPage from './login/LoginPage';
import Logout from './Logout';

const App = () => (
	<Switch>
		<Route exact path='/' component={ Home } />
		<Route path='/snacks' component={ Snacks } />
		<Route path='/login' component={ LoginPage } />
		<Route path='/logout' component={ Logout } />
	</Switch>
)

export default App;
