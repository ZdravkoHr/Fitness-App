import { useState, useEffect } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import uuid from 'react-uuid';

const WorkoutForm = ({ workout }) => {
	const [workoutInfo, setWorkoutInfo] = useState({
		...workout,
		exercises: workout?.exercises || [],
	});

	const [workoutName, setWorkoutName] = useState(workout?.name || '');
	const [inputFields, setInputFields] = useState([]);

	const addExercise = () => {
		workoutInfo.exercises.push('');
		updateInputFields();
	};

	const removeExercise = index => {
		workoutInfo.exercises.splice(index, 1);
		updateInputFields();
	};

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

	const inputGroup = (number, value) => {
		return (
			<div className='form-group exercises-group' key={uuid()}>
				<span className='number'>{number}</span>
				<input
					type='text'
					value={value}
					onChange={e => changeExercise(e, number - 1)}
				/>
				<span
					className='remove-exercise'
					onClick={() => removeExercise(number - 1)}
				>
					<DeleteIcon />
				</span>
			</div>
		);
	};

	const updateInputFields = () => {
		const inputFields = workoutInfo.exercises.map((exercise, index) => {
			return inputGroup(index + 1, exercise);
		});

		setInputFields(inputFields);
	};

	useEffect(() => {
		updateInputFields();
	}, []);

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

			{inputFields.map(field => field)}

			<span className='add-exercises' onClick={addExercise}>
				<AddCircleOutlineIcon />
			</span>
		</form>
	);
};

export default WorkoutForm;
