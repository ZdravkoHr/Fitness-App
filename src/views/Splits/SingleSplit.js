import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import uuid from 'react-uuid';
import SingleSplitEl from './SingleSplit.style';
import { DragObject } from './drag-react';
import WorkoutBox from 'components/Splits/WorkoutBox';
import FakeItem from './FakeItem';
import DeleteIcon from '@material-ui/icons/Delete';
import { useSelector } from 'react-redux';
import { workoutsSelector, dragSelector } from 'store';

const SingleSplit = () => {
	const { action } = useParams();

	const [isDragging, setIsDragging] = useState(false);

	const {
		appData: { workouts },
	} = useSelector(workoutsSelector);

	const {
		dragging,
		initCoords,
		clientCoords,
		fakeCoords,
		item,
		data: dragData,
		dragID,
	} = useSelector(dragSelector);

	const restObj = {
		name: 'rest',
		isRest: true,
		id: uuid(),
	};

	const [splitWorkouts, setSplitWorkouts] = useState([]);
	const [allWorkouts, setAllWorkouts] = useState([]);
	const [showDeleteArea, setShowDeleteArea] = useState(false);

	const reorderingIndexes = useRef([]);

	const dropBox = useRef();
	const deleteArea = useRef();

	const DeleteArea = () => {
		return (
			<div ref={deleteArea} className='delete-area'>
				<DeleteIcon />
			</div>
		);
	};

	const dropData = () => {
		const newWorkout = { ...dragData, sampleId: uuid() };
		setSplitWorkouts(workouts => [...workouts, newWorkout]);
	};

	const ae = arg => {
		console.log('test fn: ', arg);
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

	const moveHandler = (e, { isColliding, dragInfo, clientCoords }) => {
		const dragObjects = dropBox.current.querySelectorAll('.drag-object');

		for (const index in [...dragObjects]) {
			const object = dragObjects[index];

			// const {
			// 	x: targetX,
			// 	width: targetWidth,
			// 	y: targetY,
			// 	height: targetHeight,
			// } = fakeRef.current.getBoundingClientRect();

			if (object.className.includes('dragging')) {
				continue;
			}

			if (reorderingIndexes.current[index]) {
				continue;
			}

			const {
				x: objX,
				width: objWidth,
				y: objY,
				height: objHeight,
			} = object.getBoundingClientRect();

			const midPoint = fakeCoords.x + fakeCoords.width / 2;

			// y <= bottom
			if (fakeCoords.y > objY + objHeight) continue;

			// if (
			// 	midPoint <= objX + objWidth &&
			// 	targetX + targetWidth >= objX + objWidth
			// ) {
			// 	reorderingIndexes.current[index] = true;
			// 	setSplitWorkouts(workouts => {
			// 		const workoutsCopy = [...workouts];
			// 		const [reorderItem] = workoutsCopy.splice(index, 1);
			// 		workoutsCopy.splice(index + 1, 0, reorderItem);
			// 		reorderingIndexes.current[index] = false;

			// 		return workoutsCopy;
			// 	});
			// 	break;
			// }

			console.log(fakeCoords.x);

			if (
				fakeCoords.x + fakeCoords.width >= objX + objWidth / 2 &&
				fakeCoords.x <= objX
			) {
				reorderingIndexes.current[index] = true;

				// dragInfo.current.initCoords.x =
				// 	targetX + getTranslateXValue(e.target).numValue;
				setSplitWorkouts(workouts => {
					const workoutsCopy = [...workouts];
					const [reorderItem] = workoutsCopy.splice(index, 1);
					workoutsCopy.splice(index - 1, 0, reorderItem);
					reorderingIndexes.current[index] = false;
					return workoutsCopy;
				});

				break;
			}
		}
	};
	const deleteWorkout = (e, dragInfo) => {
		const workoutIndex = splitWorkouts.findIndex(
			workout => workout.sampleId === dragInfo.current.data.sampleId
		);
		const workoutsCopy = [...splitWorkouts];
		workoutsCopy.splice(workoutIndex, 1);
		setSplitWorkouts(workoutsCopy);
	};

	const handleStart = info => {
		setShowDeleteArea(true);

		setIsDragging(true);
	};

	const handleEnd = () => {
		setShowDeleteArea(false);
		setIsDragging(false);
	};

	useEffect(() => {
		setAllWorkouts([restObj, ...workouts]);
	}, [workouts]);

	useEffect(() => {
		document.addEventListener(
			'touchstart',
			e => {
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

			{dragging && (
				<FakeItem>{<WorkoutBox workout={dragData} test={ae} />}</FakeItem>
			)}
			{/* <WorkoutBox workout={dragInfo}/> */}

			<div className='split-info'>
				<div className='workouts-sequence'>
					<div className='all-workouts-field'>
						{allWorkouts.map((workout, index) => {
							return (
								<DragObject
									key={workout.id}
									id={workout.id}
									dropBoxes={[dropBox]}
									dropCb={dropData}
									dragData={workout}
									index={index}
									className='drag-object'
								>
									<WorkoutBox workout={workout} />
								</DragObject>
							);
						})}
					</div>

					<div className='split-workouts-field' ref={dropBox}>
						{splitWorkouts.map((workout, index) => {
							return (
								<DragObject
									key={workout.sampleId}
									id={workout.sampleId}
									index={index}
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
