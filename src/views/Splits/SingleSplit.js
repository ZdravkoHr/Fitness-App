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
	const rightShifts = useRef(0);

	const [isDragging, setIsDragging] = useState(false);
	const [dragInfo, setDragInfo] = useState({});

	const {
		appData: { workouts },
	} = useSelector(workoutsSelector);

	const {
		dragging,
		initCoords,
		clientCoords,

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
	//const [clientCoords, setClientCoords] = useState({});
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
		console.log('DRAG DATA: ', dragData);
		const newWorkout = { ...dragData, sampleId: uuid() };
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

	const moveHandler = (e, { isColliding, dragInfo, clientCoords }) => {
		//	const parent = e.target.parentNode.parentNode;
		//setClientCoords(clientCoords);
		setDragInfo(dragInfo.current);
		const dragObjects = dropBox.current.querySelectorAll('.drag-object');

		for (const index in [...dragObjects]) {
			const object = dragObjects[index];

			const {
				x: targetX,
				width: targetWidth,
				y: targetY,
				height: targetHeight,
			} = e.target.getBoundingClientRect();

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

			const midPoint = targetX + targetWidth / 2;

			// y <= bottom
			if (targetY > objY + objHeight) continue;

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

			if (targetX + targetWidth >= objX + objWidth / 2 && targetX <= objX) {
				console.log(object);
				reorderingIndexes.current[index] = true;

				dragInfo.current.initCoords.x =
					targetX + getTranslateXValue(e.target).numValue;
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
		setDragInfo(info);
		setIsDragging(true);
	};

	const handleEnd = () => {
		setShowDeleteArea(false);
		setIsDragging(false);

		setDragInfo({});
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

	useEffect(() => {
		console.log(dragging);
	}, [dragging]);

	return (
		<SingleSplitEl className='container single-split'>
			<div className='title'>
				<h1>{action === 'add' ? 'Add a new split' : 'Edit your split'}</h1>
			</div>

			{dragging && (
				<FakeItem dragInfo={dragInfo}>
					{<WorkoutBox workout={dragData} />}
				</FakeItem>
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
