import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { userSelector } from 'store';
import uuid from 'react-uuid';
import { db } from '../../firebase';
import { capitalize, areWorkoutsDifferent } from 'helpers';
import WorkoutsEl from './Workouts.style';
import WorkoutForm from 'components/Workouts/WorkoutForm';
import Modal from 'components/Modal';
import Spinner from 'components/Spinner';
import { setDbAppData } from 'store/slices/user';

const Workouts = () => {
	const dispatch = useDispatch();

	const [isLoading, setIsLoading] = useState(true);
	const [isModalOpened, setIsModalOpened] = useState(false);
	const [mode, setMode] = useState('adding');
	const [currentWorkout, setCurrentWorkout] = useState({});
	const [workouts, setWorkouts] = useState([]);
	const {
		user,
		logged,
		appData,
		appData: { workouts: userWorkouts },
		dbAppData: { workouts: dbWorkouts },
	} = useSelector(userSelector);

	const addHandler = () => {
		setIsModalOpened(true);
	};

	const updateHandler = () => {
		console.log(areWorkoutsDifferent(dbWorkouts, workouts));
		if (!areWorkoutsDifferent(dbWorkouts, workouts)) return;
		db.collection('users').doc(user.uid).set({
			workouts,
		});
		dispatch(
			setDbAppData({
				...appData,
				workouts,
			})
		);
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
			{isModalOpened ? (
				<Modal
					heading={mode === 'adding' ? 'Add a workout' : 'Edit workout'}
					closeCb={() => setIsModalOpened(false)}
				>
					<div>
						<WorkoutForm workout={currentWorkout} mode={mode} />
					</div>
				</Modal>
			) : (
				''
			)}

			<WorkoutsEl className='container workouts'>
				<h1>Your Workouts</h1>
				<section className='workouts-list'>
					<header className='top'>
						<h2>You have {workouts.length} workouts</h2>
						<button className='btn btn-green btn-rounded' onClick={addHandler}>
							Add Workout +
						</button>
					</header>

					<article className='workout-boxes'>
						{workouts.map(workout => {
							return (
								<div className='single-workout' key={uuid()}>
									{capitalize(workout.name)}
								</div>
							);
						})}
					</article>

					<footer className='bottom'>
						<button
							className='btn btn-green btn-rounded'
							onClick={updateHandler}
						>
							Update Workouts
						</button>
					</footer>
				</section>
			</WorkoutsEl>
		</>
	);
};

export default Workouts;
