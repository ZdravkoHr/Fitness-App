import { useState, useEffect } from 'react';
import { db, auth } from '../../firebase';

const Workouts = () => {
	const [workouts, setWorkouts] = useState(null);
	const email = auth.currentUser?.email;

	useEffect(() => {
		console.log('yo');
		if (!email) return;
		const result = db.collection(email);
		console.log('result ', result);
	}, []);

	return <main className='container workouts'></main>;
};

export default Workouts;
