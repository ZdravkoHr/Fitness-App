import { useState, useEffect } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import SaveIcon from '@material-ui/icons/Save';
import uuid from 'react-uuid';
import { useDispatch } from 'react-redux';
import { addWorkout } from 'store/slices/user';

const WorkoutForm = ({ workout, mode }) => {
	const dispatch = useDispatch();
	const [workoutInfo, setWorkoutInfo] = useState({
		name: workout?.name || '',
		exercises: workout?.exercises || [],
	});

	const [inputFields, setInputFields] = useState([]);
	const [exercises, setExercises] = useState(workoutInfo.exercises);
	const [saved, setSaved] = useState(false);

	const addExercise = () => {
		setWorkoutInfo({
			...workoutInfo,
			exercises: [...workoutInfo.exercises, { id: uuid(), name: '' }],
		});
	};

	const removeExercise = index => {
		setWorkoutInfo({
			...workoutInfo,
			exercises: [
				...workoutInfo.exercises.slice(0, index),
				...workoutInfo.exercises.slice(index + 1),
			],
		});
	};

	const changeExercise = ({ target: { value } }, index) => {
		setWorkoutInfo({
			...workoutInfo,
			exercises: [
				...workoutInfo.exercises.slice(0, index),
				{ id: workoutInfo.exercises[index].id, name: value },
				...workoutInfo.exercises.slice(index + 1),
			],
		});
	};

	const saveChanges = async e => {
		e.preventDefault();

		const newExercises = workoutInfo.exercises.filter(Boolean).map(exercise => {
			return { ...exercise, name: exercise.name.trim() };
		});

		setSaved(true);
		setWorkoutInfo({
			...workoutInfo,
			exercises: newExercises,
		});
	};

	const inputGroup = (number, value) => {
		return (
			<div className='form-group exercises-group' key={value.id}>
				<span className='number'>{number}</span>
				<input
					type='text'
					value={value.name}
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
	}, [workoutInfo.exercises]);

	useEffect(() => {
		if (!saved) return;
		if (mode === 'adding') {
			dispatch(addWorkout(workoutInfo));
		}
	}, [workoutInfo]);

	return (
		<form onSubmit={saveChanges}>
			<div className='form-group name-group'>
				<label htmlFor='name'>Workout Name</label>
				<input
					type='text'
					id='name'
					value={workoutInfo.name}
					onChange={e =>
						setWorkoutInfo({ ...workoutInfo, name: e.target.value })
					}
				/>
			</div>

			{inputFields.map(field => field)}

			<span className='add-exercises' onClick={addExercise}>
				<AddCircleOutlineIcon />
			</span>

			<button
				className={`btn btn-${
					mode === 'adding' ? 'btn-add-workout' : 'btn-save-workout'
				}`}
			>
				<SaveIcon />
			</button>
		</form>
	);
};

export default WorkoutForm;
