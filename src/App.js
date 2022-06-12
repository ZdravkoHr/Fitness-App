import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Router, Switch, Route } from 'react-router-dom';

import { auth, db } from './firebase';
import { useSelector } from 'react-redux';
import { login } from 'store/slices/user';
import { setAppData, setDbData } from 'store/slices/workouts';
import { userSelector } from 'store';
import { history } from 'helpers';
import './App.scss';
import Navbar from 'components/Navbar';
import Sidebar from 'components/Sidebar';
import Home from 'views/Home';
import Workouts from 'views/Workouts';
import Diary from 'views/Diary';

import Signup from 'views/Signup';
import Signin from 'views/Signin';
import ResetPassword from 'views/ResetPassword';
import { setDiary } from 'store/slices/diary';

function App() {
	const dispatch = useDispatch();

	const [isSidebarOpened, setIsSidebarOpened] = useState(false);
	const [user, setUser] = useState(null);
	const { logged } = useSelector(userSelector);

	useEffect(() => {
		auth.onAuthStateChanged(userAuth => {
			if (!userAuth) return;
			setUser({
				email: userAuth.email,
				displayName: userAuth.displayName,
				uid: userAuth.uid,
			});
		});
	}, []);

	useEffect(() => {
		if (user) {
			dispatch(login(user));
		}
	}, [user]);

	const getData = async () => {
		const snapshot = await db.collection('users').doc(user.uid).get('workouts');
		const data = snapshot.data();
		const { workouts, diary } = data;

		if (workouts) {
			dispatch(setAppData(workouts));
			dispatch(setDbData(workouts));
		}

		if (diary) {
			dispatch(setDiary(diary));
		}
	};

	useEffect(() => {
		if (!logged) return;
		getData();
	}, [logged]);

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
					<Route path='/diary' exact>
						<Diary />
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
