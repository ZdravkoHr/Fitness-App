import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Router, Switch, Route } from 'react-router-dom';
import { auth } from './firebase';
import { login, logout } from 'store/slices/user';
import { history } from 'helpers';
import './App.scss';
import Navbar from 'components/Navbar';
import Sidebar from 'components/Sidebar';
import Home from 'views/Home';
import Workouts from 'views/Workouts';
import Signup from 'views/Signup';
import Signin from 'views/Signin';
import ResetPassword from 'views/ResetPassword';

function App() {
	const dispatch = useDispatch();

	const [isSidebarOpened, setIsSidebarOpened] = useState(false);
	const [user, setUser] = useState(null);

	useEffect(() => {
		auth.onAuthStateChanged(userAuth => {
			if (userAuth) {
				setUser({
					email: userAuth.email,
					displayName: userAuth.displayName,
					uid: userAuth.uid,
				});

				return;
			}

			setUser(null);
		});
	}, []);

	useEffect(() => {
		if (user) {
			dispatch(login(user));
			return;
		}
		dispatch(logout(false));
	}, [user]);

	return (
		<div className='App'>
			<Router history={history}>
				<Navbar openSidebar={() => setIsSidebarOpened(true)} />
				<Sidebar
					opened={isSidebarOpened}
					closeSidebar={() => setIsSidebarOpened(false)}
				/>
				<Switch>
					<Route path='/' exact>
						<Home />
					</Route>
					<Route path='/workouts' exact>
						<Workouts />
					</Route>
					<Route path='/signin'>
						<Signin />
					</Route>
					<Route path='/signup'>
						<Signup />
					</Route>
					<Route path='/resetpassword'>
						<ResetPassword />
					</Route>
				</Switch>
			</Router>
		</div>
	);
}

export default App;
