import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './Home';
import Snacks from './Snacks';

const App = () => (
	<Switch>
		<Route exact path='/' component={ Home } />
		<Route path='/snacks' component={ Snacks } />
	</Switch>
)

export default App;
