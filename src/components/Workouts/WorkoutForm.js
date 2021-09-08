import { useState } from 'react';

const WorkoutForm = ({ workout }) => {
	const [workoutInfo, setWorkoutInfo] = useState({
		...workout,
		exercises: workout?.exercises || [],
	});

	const [workoutName, setWorkoutName] = useState(workout?.name || '');
	const [exercisesCount, setExercisesCount] = useState(0);

	const changeExercise = ({ target: { value } }, index) => {
		setWorkoutInfo({
			...workoutInfo,
			exercises: [
				...workoutInfo.exercises.slice(0, index),
				value.trim(),
				...workoutInfo.slice(index + 1),
			],
		});
	};

	return (
		<form>
			<div className='form-group name-group'>
				<label htmlFor='name'>Workout Name</label>
				<input
					type='text'
					id='name'
					value={workoutName}
					onChange={e => setWorkoutName(e.target)}
				/>
			</div>
			<div className='form-group exercises-group'>
				{workoutInfo.exercises.map((exercise, index) => {
					setExercisesCount(index + 1);
					return (
						<>
							<span className='number'>{exercisesCount}</span>
							<input
								type='text'
								value={exercise}
								onChange={e => changeExercise(e, index)}
							/>
						</>
					);
				})}
			</div>
		</form>
	);
};

export default WorkoutForm;
