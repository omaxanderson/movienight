import react from 'react';
import url from './url';

var Logout = () => {
	fetch(url + '/user/logout', { credentials: 'include' })
		.then( res => {
			return res.json();
		})
		.then( data => {
			console.log(data);
			window.location.href = '/login';
		})
		.catch((err) => {
			console.error(err);
		});
};

export default Logout;
