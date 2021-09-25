import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeWorkout } from 'store/slices/user';
import { userSelector } from 'store';
import { db } from '../../firebase';
import uuid from 'react-uuid';
import { areWorkoutsDifferent } from 'helpers';
import WorkoutsEl from './Workouts.style';
import WorkoutForm from 'components/Workouts/WorkoutForm';
import Modal from 'components/Modal';
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

	const addHandler = () => {
		// setIsModalOpened(true);
		// setMode('adding');

		const newWorkout = {
			id: uuid(),
			name: '',
			exercises: [],
		};

		setCurrentWorkout(newWorkout);

		setWorkouts([...workouts, newWorkout]);
	};

	const deleteWorkout = (e, id) => {
		e.stopPropagation();
		dispatch(removeWorkout(id));
	};

	const editWorkout = (e, id) => {
		const workout = workouts.find(item => item.id === id);
		// setMode('editing');
		// setIsModalOpened(true);
		setCurrentWorkout(workout);
	};

	const closeModal = () => {
		// setIsModalOpened(false);
		setCurrentWorkout({});
	};

	const updateHandler = () => {
		console.log('dbworkouts: ', dbWorkouts);
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
			{/* {isModalOpened ? (
				<Modal
					heading={mode === 'adding' ? 'Add a workout' : 'Edit workout'}
					closeCb={closeModal}
				>
					<div>
						<WorkoutForm workout={currentWorkout} mode={mode} />
					</div>
				</Modal>
			) : (
				''
			)} */}

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

					<article className='workout-items'>
						{workouts.map(workout => {
							const opened = workout.id === currentWorkout.id;
							return (
								// <div
								// 	className='single-workout'
								// 	key={workout.id}
								// 	onClick={e => editWorkout(e, workout.id)}
								// >
								// 	{workout.name}
								// 	<div
								// 		className='close-icon'
								// 		onClick={e => deleteWorkout(e, workout.id)}
								// 	>
								// 		&times;
								// 	</div>
								// </div>
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
