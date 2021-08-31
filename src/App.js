import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { auth } from './firebase';
import { login, logout } from 'store/slices/user';
import './App.css';
import Navbar from 'components/Navbar';
import Sidebar from 'components/Sidebar';
import Home from 'views/Home';
import Signup from 'views/Signup';

function App() {
	const dispatch = useDispatch();

	const [isSidebarOpened, setIsSidebarOpened] = useState(false);

	useEffect(() => {
		auth.onAuthStateChanged(userAuth => {
			if (userAuth) {
				dispatch(
					login({
						email: userAuth.email,
						password: userAuth.password,
						displayName: userAuth.displayName,
						uid: userAuth.uid,
					})
				);
				return;
			}

			dispatch(logout());
		});
	}, []);

	return (
		<div className='App'>
			<Router>
				<Navbar openSidebar={() => setIsSidebarOpened(true)} />
				<Sidebar
					opened={isSidebarOpened}
					closeSidebar={() => setIsSidebarOpened(false)}
				/>
				<Switch>
					<Route path='/' exact>
						<Home />
					</Route>
					<Route path='/signup'>
						<Signup />
					</Route>
				</Switch>
			</Router>
		</div>
	);
}

export default App;
