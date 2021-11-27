import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import uuid from 'react-uuid';
import SingleSplitEl from './SingleSplit.style';
import { DragObject } from './drag-react';
import WorkoutBox from 'components/Splits/WorkoutBox';
import DeleteIcon from '@material-ui/icons/Delete';
import { useSelector } from 'react-redux';
import { workoutsSelector } from 'store';

const SingleSplit = () => {
	const { action } = useParams();
	const rightShifts = useRef(0);

	const [dragInfo, setDragInfo] = useState({});

	const {
		appData: { workouts },
	} = useSelector(workoutsSelector);

	const restObj = {
		name: 'rest',
		isRest: true,
		id: uuid(),
	};

	const [splitWorkouts, setSplitWorkouts] = useState([]);
	const [allWorkouts, setAllWorkouts] = useState([]);
	const [showDeleteArea, setShowDeleteArea] = useState(false);

	const transitioningIndexes = useRef([]);

	const dropBox = useRef();
	const deleteArea = useRef();

	const DeleteArea = () => {
		return (
			<div ref={deleteArea} className='delete-area'>
				<DeleteIcon />
			</div>
		);
	};

	const dropData = (e, dragInfo) => {
		const newWorkout = { ...dragInfo.current.data, sampleId: uuid() };
		setSplitWorkouts(workouts => [...workouts, newWorkout]);
	};

	const getTranslateXValue = el => {
		const str = el.style.transform;
		const lastSymbol = str.includes('X') ? ')' : ',';
		const startIndex = str.indexOf('(') + 1;
		const endIndex = str.indexOf(lastSymbol);
		const pxValue = str.slice(startIndex, endIndex);
		const numValue = Number(pxValue.slice(0, -2));

		return { pxValue, numValue };
	};

	const moveHandler = (e, { isColliding, dragInfo }) => {
		const parent = e.target.parentNode.parentNode;
		const dragObjects = parent.querySelectorAll('.drag-object');
		const isOverObject = isColliding(e.target);

		// dragObjects.forEach((object, index) => {
		// 	if (object === e.target.parentNode) return;
		// 	if (transitioningIndexes.current.includes(index)) return;
		// 	console.log(isOverObject(object))
		// 	if (!isOverObject(object)) return;

		// 	const { x: targetX, width: targetWidth } =
		// 		e.target.getBoundingClientRect();

		// 	const { x: objX, width: objWidth } = object.getBoundingClientRect();
		// 	const translateX = getTranslateXValue(object).numValue;
		// 	if (Math.abs(translateX) > objWidth + 5) return;
		// 	console.log(translateX, objWidth);

		// 	if (
		// 		targetX <= objX + objWidth / 2 &&
		// 		targetX + targetWidth > objX + objWidth
		// 	) {
		// 		if (Math.abs(translateX + objWidth) > objWidth + 5) return;
		// 		setSplitWorkouts(w => {
		// 		const n = [...w];
		// 		const f = n.shift();
		// 		n.push(f);
		// 		transitioningIndexes.current.push(0);
		// 		return n;
		// 	})
		// 		rightShifts.current--;
		// 	}

		// 	if (
		// 		targetX + targetWidth >= objX + objWidth / 2 &&
		// 		targetX < objX &&
		// 		targetX > objWidth
		// 	) {
		// 		if (Math.abs(translateX - objWidth) > objWidth + 5) return;
		// 		object.style.transform = `translateX(${translateX - objWidth}px)`;
		// 		rightShifts.current++;
		// 	}
		// });
	};
	const deleteWorkout = (e, dragInfo) => {
		const workoutIndex = splitWorkouts.findIndex(
			workout => workout.sampleId === dragInfo.current.data.sampleId
		);
		console.log(splitWorkouts, dragInfo.current.data.sampleId, workoutIndex);
		const workoutsCopy = [...splitWorkouts];
		workoutsCopy.splice(workoutIndex, 1);
		setSplitWorkouts(workoutsCopy);
	};

	const handleStart = info => {
		setShowDeleteArea(true);
		console.log(info);
		setDragInfo(info);
	};

	const handleEnd = () => {
		setShowDeleteArea(false);
		setDragInfo({});
	};

	useEffect(() => {
		setAllWorkouts([restObj, ...workouts]);
	}, [workouts]);

	useEffect(() => {
		document.addEventListener(
			'touchstart',
			e => {
				console.log('preventing');
				e.preventDefault();
			},
			{ passive: false }
		);
	}, []);

	return (
		<SingleSplitEl className='container single-split'>
			<div className='title'>
				<h1>{action === 'add' ? 'Add a new split' : 'Edit your split'}</h1>
			</div>

			{/* <WorkoutBox workout={dragInfo}/> */}

			<div className='split-info'>
				<div className='workouts-sequence'>
					<div className='all-workouts-field'>
						{allWorkouts.map(workout => {
							return (
								<DragObject
									key={workout.id}
									dropBoxes={[dropBox]}
									dropCb={dropData}
									dragData={workout}
									className='drag-object'
								>
									<WorkoutBox workout={workout} />
								</DragObject>
							);
						})}
					</div>

					<div className='split-workouts-field' ref={dropBox}>
						{splitWorkouts.map(workout => {
							return (
								<DragObject
									key={workout.sampleId}
									dragData={workout}
									dropBoxes={[deleteArea]}
									moveCb={moveHandler}
									startCb={handleStart}
									endCb={handleEnd}
									dropCb={deleteWorkout}
									className='drag-object'
								>
									<WorkoutBox workout={workout} />
								</DragObject>
							);
						})}
					</div>
				</div>
			</div>

			{showDeleteArea && DeleteArea()}
		</SingleSplitEl>
	);
};

export default SingleSplit;
