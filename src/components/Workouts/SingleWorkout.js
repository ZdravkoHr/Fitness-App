import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import uuid from 'react-uuid';
import DeleteIcon from '@material-ui/icons/Delete';
import Panel from 'components/Panel';
import WorkoutMain from './WorkoutMain.style';
import useOutsideClick from 'hooks/useOutsideClick';
import { modifyWorkouts, removeWorkout } from 'store/slices/workouts';

const SingleWorkout = ({ workout, opened }) => {
	const dispatch = useDispatch();
	const [workoutInfo, setWorkoutInfo] = useState({
		id: workout.id || uuid(),
		name: workout.name || '',
		exercises: workout.exercises || [],
	});
	const panelRef = useRef();
	const outsideClick = useOutsideClick(panelRef);

	const [saved, setSaved] = useState(true);

	const addExercise = () => {
		setWorkoutInfo({
			...workoutInfo,
			exercises: [...workoutInfo.exercises, { id: uuid(), name: '' }],
		});
	};

	const removeExercise = index => {
		setSaved(false);
		setWorkoutInfo({
			...workoutInfo,
			exercises: [
				...workoutInfo.exercises.slice(0, index),
				...workoutInfo.exercises.slice(index + 1),
			],
		});
	};

	const changeName = name => {
		setWorkoutInfo({
			...workoutInfo,
			name,
		});
		setSaved(false);
	};

	const changeExercise = (value, index) => {
		setSaved(false);
		const newWorkout = {
			...workoutInfo,
			exercises: [
				...workoutInfo.exercises.slice(0, index),
				{ id: workoutInfo.exercises[index].id, name: value },
				...workoutInfo.exercises.slice(index + 1),
			],
		};

		setWorkoutInfo(newWorkout);
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
					onChange={e => changeExercise(e.target.value, number - 1)}
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

	useEffect(() => {
		if (saved || !outsideClick[0]) return;
		dispatch(modifyWorkouts(workoutInfo));
		setSaved(true);
	}, [outsideClick]);

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
			<WorkoutMain ref={panelRef}>
				<div className='form-group name-group'>
					<label htmlFor='name'>Workout Name</label>

					<input
						type='text'
						id='name'
						value={workoutInfo.name}
						onChange={e => changeName(e.target.value)}
					/>
				</div>

				{workoutInfo.exercises.map((exercise, index) => {
					return inputGroup(index + 1, exercise);
				})}

				<span className='add-exercise' onClick={addExercise}>
					Add Exercise
				</span>
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
