import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { userSelector } from 'store';
import { db } from '../../firebase';
import uuid from 'react-uuid';
import { areWorkoutsDifferent } from 'helpers';
import WorkoutsEl from './Workouts.style';
import Spinner from 'components/Spinner';
import { setDbAppData } from 'store/slices/user';
import SingleWorkout from 'components/Workouts/SingleWorkout';

const Workouts = () => {
	const dispatch = useDispatch();

	const [isLoading, setIsLoading] = useState(true);
	// const [isModalOpened, setIsModalOpened] = useState(false);
	//const [mode, setMode] = useState('adding');
	const [currentWorkout, setCurrentWorkout] = useState({});
	const [workouts, setWorkouts] = useState([]);
	const {
		user,
		logged,
		appData,
		appData: { workouts: userWorkouts },
		dbAppData: { workouts: dbWorkouts },
	} = useSelector(userSelector);
	const workoutsRef = useRef();

	const addHandler = () => {
		const newWorkout = {
			id: uuid(),
			name: '',
			exercises: [],
		};

		setCurrentWorkout(newWorkout);
		setWorkouts([...workouts, newWorkout]);
	};

	const saveWorkouts = () => {
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
			<WorkoutsEl className='container workouts'>
				<h1>Your Workouts</h1>
				<section className='workouts-list'>
					<header className='top'>
						<h2>
							You have {workouts.length}{' '}
							{workouts.length === 1 ? 'workout' : 'workouts'}
						</h2>
						<button
							className='btn btn-green btn-rounded'
							onClick={addHandler}
							disabled={workouts.length !== userWorkouts.length}
						>
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
