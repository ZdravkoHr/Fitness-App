import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import uuid from 'react-uuid';
import DeleteIcon from '@material-ui/icons/Delete';
import Panel from 'components/Panel';
import DebounceInput from 'components/DebounceInput';
import WorkoutMain from './WorkoutMain.style';
import { areWorkoutsDifferent } from 'helpers';
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

	const changeExercise = (value, index) => {
		const newWorkout = {
			...workoutInfo,
			exercises: [
				...workoutInfo.exercises.slice(0, index),
				{ id: workoutInfo.exercises[index].id, name: value },
				...workoutInfo.exercises.slice(index + 1),
			],
		};

		areWorkoutsDifferent(workoutInfo, newWorkout) && setWorkoutInfo(newWorkout);
	};

	const deleteWorkout = e => {
		dispatch(removeWorkout(workout.id));
	};

	const inputGroup = (number, value) => {
		return (
			<div className='form-group exercises-group' key={value.id}>
				<span className='number'>{number}</span>
				<DebounceInput
					type='text'
					initialValue={value.name}
					onChangeCb={inputValue => {
						changeExercise(inputValue, number - 1);
					}}
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
		//if (!saved) return;
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
					<DebounceInput
						type='text'
						id='name'
						initialValue={workoutInfo.name}
						onChangeCb={inputValue => {
							inputValue !== workoutInfo.name &&
								setWorkoutInfo({ ...workoutInfo, name: inputValue.trim() });
						}}
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
