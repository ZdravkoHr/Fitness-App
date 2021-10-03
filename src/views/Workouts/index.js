import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { userSelector, workoutsSelector } from 'store';
import { db } from '../../firebase';
import uuid from 'react-uuid';
import { areWorkoutsDifferent } from 'helpers';
import WorkoutsEl from './Workouts.style';
import Spinner from 'components/Spinner';
import { modifyWorkouts, setDbData } from 'store/slices/workouts';
import SingleWorkout from 'components/Workouts/SingleWorkout';
import NotificationBox from 'components/Notifications/NotificationBox';

const Workouts = () => {
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(true);
	const [notificationData, setNotificationData] = useState({});
	const [currentWorkout, setCurrentWorkout] = useState({});
	const [workouts, setWorkouts] = useState([]);

	const { user, logged } = useSelector(userSelector);
	const {
		appData,
		appData: { workouts: userWorkouts },
		dbData: { workouts: dbWorkouts },
	} = useSelector(workoutsSelector);
	const workoutsRef = useRef();

	const addHandler = () => {
		const newWorkout = {
			id: uuid(),
			name: '',
			exercises: [],
		};

		setCurrentWorkout(newWorkout);
		dispatch(modifyWorkouts(newWorkout));
	};

	const showSavedNotification = success => {
		setNotificationData({
			active: true,
			fail: !success,
			text: success
				? 'You have successfully saved your data.'
				: 'You have not made any changes to your data.',
		});
	};

	const saveWorkouts = () => {
		console.log(dbWorkouts);
		console.log(workouts);
		if (!areWorkoutsDifferent(dbWorkouts, workouts)) {
			showSavedNotification(false);
			return;
		}
		db.collection('users').doc(user.uid).set({
			workouts,
		});
		dispatch(
			setDbData({
				...appData,
				workouts,
			})
		);

		showSavedNotification(true);
	};

	useEffect(() => {
		setWorkouts(userWorkouts);
	}, [userWorkouts]);

	useEffect(() => {
		if (logged !== null) {
			setIsLoading(false);
		}
	}, [logged]);

	if (isLoading) {
		return <Spinner />;
	}

	if (!user) {
		return (
			<main className='container workouts'>
				<h2>Log in to see your workouts</h2>
			</main>
		);
	}

	return (
		<>
			<WorkoutsEl className='container workouts'>
				<h1>Your Workouts</h1>
				<NotificationBox
					active={notificationData?.active}
					fail={notificationData?.fail}
					text={notificationData?.text}
					closeCb={() => setNotificationData({})}
				/>
				<section className='workouts-list'>
					<header className='top'>
						<h2>
							You have {workouts.length}{' '}
							{workouts.length === 1 ? 'workout' : 'workouts'}
						</h2>
						<button className='btn btn-green btn-rounded' onClick={addHandler}>
							Add Workout +
						</button>
					</header>

					<article className='workout-items' ref={workoutsRef}>
						{workouts.map(workout => {
							const opened = workout.id === currentWorkout.id;
							return (
								<SingleWorkout
									key={workout.id}
									workout={workout}
									opened={opened}
								/>
							);
						})}
					</article>

					<footer className='bottom'>
						<button
							className='btn btn-green btn-rounded'
							onClick={saveWorkouts}
						>
							Save
						</button>
					</footer>
				</section>
			</WorkoutsEl>
		</>
	);
};

export default Workouts;
