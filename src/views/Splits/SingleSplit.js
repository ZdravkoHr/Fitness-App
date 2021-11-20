import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import uuid from 'react-uuid';
import SingleSplitEl from './SingleSplit.style';
//import { DragObject } from './drag-react';
//import { DndProvider } from 'react-dnd';
//import { TouchBackend } from 'react-dnd-touch-backend';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import WorkoutBox from 'components/Splits/WorkoutBox';
import DropArea from './DropArea.js';
import DeleteIcon from '@material-ui/icons/Delete';
import { useSelector } from 'react-redux';
import { workoutsSelector } from 'store';

const SingleSplit = () => {
	const { action } = useParams();

	const {
		appData: { workouts },
	} = useSelector(workoutsSelector);

	const restObj = {
		name: 'rest',
		isRest: true,
		id: uuid(),
	};

	const [test, setTest] = useState(0);
	const [splitWorkouts, setSplitWorkouts] = useState([]);
	const [allWorkouts, setAllWorkouts] = useState([]);
	const [showDeleteArea, setShowDeleteArea] = useState(false);

	const workoutsField = useRef();

	const deleteArea = useRef();
	const rightShifts = useRef(0);

	const DeleteArea = () => {
		return (
			<div ref={deleteArea} className='delete-area'>
				<DeleteIcon />
			</div>
		);
	};

	const addSplitsWorkout = workout => {
		//setSplitWorkouts([...splitWorkouts, { ...workout, sampleId: uuid() }]);
		setSplitWorkouts(workouts => {
			return [...workouts, { ...workout, sampleId: uuid() }];
		});
	};

	useEffect(() => {
		console.log(splitWorkouts);
	}, [splitWorkouts]);

	// const dropData = (e, dragInfo) => {
	// 	const newWorkout = { ...dragInfo.current.data, sampleId: uuid() };
	// 	setSplitWorkouts([...splitWorkouts, newWorkout]);
	// };

	const getTranslateXValue = el => {
		const str = el.style.transform;
		const lastSymbol = str.includes('X') ? ')' : ',';
		const startIndex = str.indexOf('(') + 1;
		const endIndex = str.indexOf(lastSymbol);
		const pxValue = str.slice(startIndex, endIndex);
		const numValue = Number(pxValue.slice(0, -2));

		return { pxValue, numValue };
	};

	// const splitDragEndHandler = e => {
	// 	const id = e.target.parentNode.dataset.key;
	// 	const index = splitWorkouts.findIndex(workout => workout.sampleId === id);
	// 	const workoutsRef = [...splitWorkouts];
	// 	const item = workoutsRef.splice(index, 1);

	// 	workoutsRef.splice(index + rightShifts.current, 0, ...item);
	// 	console.log(workoutsRef);

	// 	console.log(
	// 		e.target.parentNode.parentNode.querySelectorAll('.drag-object')
	// 	);
	// 	e.target.parentNode.parentNode
	// 		.querySelectorAll('.drag-object')
	// 		.forEach(object => (object.style.transform = 'translate(0, 0)'));
	// 	setSplitWorkouts(workoutsRef);
	// 	setShowDeleteArea(false);
	// };

	const moveHandler = (e, { isColliding, dragInfo }) => {
		const parent = e.target.parentNode.parentNode;
		const dragObjects = parent.querySelectorAll('.drag-object');
		const isOverObject = isColliding(e.target);

		dragObjects.forEach(object => {
			if (object === e.target.parentNode) return;
			if (!isOverObject(object)) return;
			const { x: targetX, width: targetWidth } =
				e.target.getBoundingClientRect();

			const { x: objX, width: objWidth } = object.getBoundingClientRect();
			const translateX = getTranslateXValue(object).numValue;
			if (Math.abs(translateX) > objWidth + 5) return;
			console.log(translateX, objWidth);

			if (
				targetX <= objX + objWidth / 2 &&
				targetX + targetWidth > objX + objWidth
			) {
				if (Math.abs(translateX + objWidth) > objWidth + 5) return;
				object.style.transform = `translateX(${translateX + objWidth}px)`;
				rightShifts.current--;
			}

			if (
				targetX + targetWidth >= objX + objWidth / 2 &&
				targetX < objX &&
				targetX > objWidth
			) {
				if (Math.abs(translateX - objWidth) > objWidth + 5) return;
				object.style.transform = `translateX(${translateX - objWidth}px)`;
				rightShifts.current++;
			}
		});
	};

	// const removeWorkout = (e, dragInfo) => {
	// 	const workoutIndex = splitWorkouts.findIndex(
	// 		workout => workout.sampleId === dragInfo.current.data.sampleId
	// 	);

	// 	const workoutsCopy = [...splitWorkouts];
	// 	workoutsCopy.splice(workoutIndex, 1);
	// 	setSplitWorkouts(workoutsCopy);
	// };

	useEffect(() => {
		setAllWorkouts([restObj, ...workouts]);
	}, [workouts]);

	return (
		<SingleSplitEl className='container single-split'>
			<div className='title'>
				<h1>{action === 'add' ? 'Add a new split' : 'Edit your split'}</h1>
				{test}
			</div>

			<div className='split-info'>
				<div className='workouts-sequence'>
					<DndProvider
						backend={TouchBackend}
						options={{ enableMouseEvents: true }}
					>
						<div className='all-workouts-field'>
							{allWorkouts.map(workout => {
								return (
									// <DragObject
									// 	key={workout.id}
									// 	dropBoxes={[dropBox]}
									// 	dropCb={dropData}
									// 	dragData={workout}
									// 	className='drag-object'
									// >
									<WorkoutBox key={workout.id} workout={workout} />
									// </DragObject>
								);
							})}
						</div>

						<DropArea
							splitWorkouts={splitWorkouts}
							addWorkout={addSplitsWorkout}
						></DropArea>
					</DndProvider>
				</div>
			</div>
			<p onClick={() => setTest(test + 1)}>Increase</p>
			{showDeleteArea && DeleteArea()}
		</SingleSplitEl>
	);
};

export default SingleSplit;
