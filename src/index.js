import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import store from 'store';

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</React.StrictMode>,
	document.getElementById('root')
);
