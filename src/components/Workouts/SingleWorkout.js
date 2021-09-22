import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import uuid from 'react-uuid';
import DeleteIcon from '@material-ui/icons/Delete';
import Panel from 'components/Panel';
import WorkoutMain from './WorkoutMain.style';
import { modifyWorkouts, removeWorkout } from 'store/slices/user';

const SingleWorkout = ({ workout, opened }) => {
	const dispatch = useDispatch();
	const [workoutInfo, setWorkoutInfo] = useState({
		id: workout.id || uuid(),
		name: workout.name || '',
		exercises: workout.exercises || [],
	});
	const [inputFields, setInputFields] = useState([]);
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

	const deleteWorkout = e => {
		dispatch(removeWorkout(workout.id));
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

	const saveChanges = async e => {
		e.preventDefault();

		const newExercises = workoutInfo.exercises.map(exercise => {
			return { ...exercise, name: exercise.name.trim() };
		});

		setSaved(true);
		setWorkoutInfo({
			...workoutInfo,
			exercises: newExercises,
		});
	};

	useEffect(() => {
		updateInputFields();
	}, [workoutInfo.exercises]);

	useEffect(() => {
		if (!saved) return;
		dispatch(modifyWorkouts(workoutInfo));
		// neeeded to prevent unnecessary redux dispatches
		setTimeout(() => {
			setSaved(false);
		});
	}, [workoutInfo]);

	const PanelHeader = () => {
		return (
			<>
				<p className='workout-name'>{workoutInfo.name}</p>

				<div className='icons'>
					<DeleteIcon onClick={deleteWorkout} />
				</div>
			</>
		);
	};

	const PanelMain = () => {
		return (
			<WorkoutMain onSubmit={saveChanges}>
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

				<span className='add-exercise' onClick={addExercise}>
					Add Exercise
				</span>

				<button className='btn btn-save'>Save</button>
			</WorkoutMain>
		);
	};

	return (
		<Panel
			headerContent={PanelHeader()}
			mainContent={PanelMain()}
			opened={opened}
		/>
	);
};

export default SingleWorkout;
