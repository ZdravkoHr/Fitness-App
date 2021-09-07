import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { userSelector } from 'store';
import { db, auth } from '../../firebase';

const Workouts = () => {
	const [workouts, setWorkouts] = useState([]);
	const { user } = useSelector(userSelector);

	if (!user) {
		return (
			<main className='container workouts'>
				<h2>Log in to see your workouts</h2>
			</main>
		);
	}

	return <main className='container workouts'></main>;
};

export default Workouts;
