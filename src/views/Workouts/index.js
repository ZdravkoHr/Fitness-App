import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { userSelector } from 'store';
import WorkoutsEl from './Workouts.style';
import WorkoutForm from 'components/Workouts/WorkoutForm';
import Modal from 'components/Modal';
import Spinner from 'components/Spinner';

const Workouts = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [workouts, setWorkouts] = useState([]);
	const { user, logged } = useSelector(userSelector);

	const addHandler = () => {};

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
			<Modal heading={'Add a workout'}>
				<div>
					<WorkoutForm />
				</div>
			</Modal>
			<WorkoutsEl className='container workouts'>
				<h1>Your Workouts</h1>
				<section className='workouts-list'>
					<div className='top'>
						<h2>You have {workouts.length} workouts</h2>
						<button className='btn btn-green btn-rounded' onClick={addHandler}>
							Add Workout +
						</button>
					</div>
				</section>
			</WorkoutsEl>
		</>
	);
};

export default Workouts;
