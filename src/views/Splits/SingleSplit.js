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

	const dropBox = useRef();
	const deleteArea = useRef();
	const rightShifts = useRef(0);

	const DeleteArea = () => {
		return (
			<div ref={deleteArea} className='delete-area'>
				<DeleteIcon />
			</div>
		);
	};

	const dropData = (e, dragInfo) => {
		const newWorkout = { ...dragInfo.current.data, sampleId: uuid() };
		setSplitWorkouts([...splitWorkouts, newWorkout]);
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

	const splitDragEndHandler = e => {
		const id = e.target.parentNode.dataset.key;
		const index = splitWorkouts.findIndex(workout => workout.sampleId === id);
		const workoutsRef = [...splitWorkouts];
		const item = workoutsRef.splice(index, 1);

		workoutsRef.splice(index + rightShifts.current, 0, ...item);
		console.log(workoutsRef);

		console.log(
			e.target.parentNode.parentNode.querySelectorAll('.drag-object')
		);
		e.target.parentNode.parentNode
			.querySelectorAll('.drag-object')
			.forEach(object => (object.style.transform = 'translate(0, 0)'));
		setSplitWorkouts(workoutsRef);
		setShowDeleteArea(false);
	};

	const moveHandler = (e, { isColliding, dragInfo }) => {
		const parent = e.target.parentNode.parentNode;
		const dragObjects = parent.querySelectorAll('.drag-object');
		const isOverObject = isColliding(e.target);

		dragObjects.forEach(object => {
			if (object === e.target.parentNode) return;
			object.style.outline = '3px solid transparent';
			if (!isOverObject(object)) return;
			const { x: targetX, width: targetWidth } =
				e.target.getBoundingClientRect();

			const { x: objX, width: objWidth } = object.getBoundingClientRect();

			if (
				targetX <= objX + objWidth / 2 &&
				targetX + targetWidth > objX + objWidth
			) {
				object.style.transform = `translateX(${objWidth}px)`;
				rightShifts.current--;
			}
			const translateX = getTranslateXValue(object).numValue;
			if (targetX + targetWidth >= objX + objWidth / 2 && targetX < objX) {
				object.style.transform = `translateX(${translateX - objWidth}px)`;
				rightShifts.current++;
			}
		});
	};

	const removeWorkout = (e, dragInfo) => {
		const workoutIndex = splitWorkouts.findIndex(
			workout => workout.sampleId === dragInfo.current.data.sampleId
		);

		const workoutsCopy = [...splitWorkouts];
		workoutsCopy.splice(workoutIndex, 1);
		setSplitWorkouts(workoutsCopy);
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
									data-key={workout.sampleId}
									dragData={workout}
									dropBoxes={[deleteArea]}
									startCb={() => setShowDeleteArea(true)}
									moveCb={moveHandler}
									endCb={splitDragEndHandler}
									dropCb={removeWorkout}
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
