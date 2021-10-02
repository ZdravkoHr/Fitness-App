import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import uuid from 'react-uuid';
import DeleteIcon from '@material-ui/icons/Delete';
import Panel from 'components/Panel';
import DebounceInput from 'components/DebounceInput';
import WorkoutMain from './WorkoutMain.style';
import { areWorkoutsDifferent } from 'helpers';
import useOutsideClick from 'hooks/useOutsideClick';
import { modifyWorkouts, removeWorkout } from 'store/slices/user';

const SingleWorkout = ({ workout, opened }) => {
	const dispatch = useDispatch();
	const [workoutInfo, setWorkoutInfo] = useState({
		id: workout.id || uuid(),
		name: workout.name || '',
		exercises: workout.exercises || [],
	});
	const [inputFields, setInputFields] = useState([]);
	const [isTimerRunning, setIsTimerRunning] = useState(false);
	const [runningTimers, setRunningTimers] = useState({});
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
	};

	useEffect(() => {
		console.log('workoutInfo: ', workoutInfo);
	}, [workoutInfo]);

	const changeExercise = (value, index) => {
		setSaved(false);
		console.log(workoutInfo);
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

	const changeTimers = (isRunning, id, value) => {
		setRunningTimers(() => {
			console.log('id: ', id);
			// console.log(runningTimers);
			// console.log({ ...runningTimers, [id]: isRunning });
			return { ...runningTimers, [id]: isRunning };
		});
	};

	const deleteWorkout = e => {
		dispatch(removeWorkout(workout.id));
	};

	const inputGroup = (number, value, timerCb) => {
		//setRunningTimers({ ...runningTimers, [value.id]: false });

		return (
			<div className='form-group exercises-group' key={value.id}>
				<span className='number'>{number}</span>
				{/* <DebounceInput
					type='text'
					initialValue={value.name}
					onChangeCb={inputValue => {
						changeExercise(inputValue, number - 1);
					}}
					timerNotifier={isRunning => {
						timerCb(isRunning, value.id);
					}}
				/> */}

				<input
					type='text'
					value={value.name}
					onChange={e => changeExercise(e.target.value, number - 1)}
					//	onBlur={() => dispatch(modifyWorkouts(workoutInfo))}
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
			return inputGroup(index + 1, exercise, changeTimers);
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
		if (saved || !outsideClick[0]) return;
		dispatch(modifyWorkouts(workoutInfo));
		setSaved(true);
	}, [outsideClick]);

	// useEffect(() => {
	// 	console.log(runningTimers);
	// 	const isTimerRunning = Object.values(runningTimers).some(Boolean);
	// 	setIsTimerRunning(isTimerRunning);
	// }, [runningTimers]);

	useEffect(() => {
		updateInputFields();
	}, [workoutInfo]);

	// useEffect(() => {
	// 	//if (!saved) return;
	// 	dispatch(modifyWorkouts(workoutInfo));
	// 	// neeeded to prevent unnecessary redux dispatches
	// 	setTimeout(() => {
	// 		setSaved(false);
	// 	});
	// }, [workoutInfo]);

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
			<WorkoutMain onSubmit={saveChanges} ref={panelRef}>
				<div className='form-group name-group'>
					<label htmlFor='name'>Workout Name</label>
					{/* <DebounceInput
						type='text'
						id='name'
						initialValue={workoutInfo.name}
						onChangeCb={inputValue => {
							inputValue !== workoutInfo.name &&
								setWorkoutInfo({ ...workoutInfo, name: inputValue.trim() });
						}}
					/> */}

					<input
						type='text'
						id='name'
						value={workoutInfo.name}
						onChange={e => changeName(e.target.value)}
						//onBlur={() => dispatch(modifyWorkouts(workoutInfo))}
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

	if (!workoutInfo) return <></>;

	return (
		<Panel
			headerContent={PanelHeader()}
			mainContent={PanelMain()}
			disabledClick={isTimerRunning}
			opened={opened}
		/>
	);
};

export default SingleWorkout;
