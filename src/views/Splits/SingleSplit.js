import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import uuid from 'react-uuid';
import SingleSplitEl from './SingleSplit.style';
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
	const dragInfo = useRef(null);
	const dropBox = useRef();

	const DeleteArea = () => {
		return (
			<div className='delete-area'>
				<DeleteIcon />
			</div>
		);
	};

	const startDragging = (e, item, isTouchEvent) => {
		e.preventDefault();
		let coords;

		console.log(e.target.clientX, e.target.clientY);

		if (isTouchEvent) {
			coords = { x: e.touches[0].clientX, y: e.touches[0].clientY };
		} else {
			coords = {
				x: e.target.clientX,
				y: e.target.clienty,
			};
		}

		dragInfo.current = {
			item,
			initCoords: coords,
		};
	};

	const moveDraggableObject = (e, isTouchEvent) => {
		e.preventDefault();
		console.log('moving');
		const root = isTouchEvent ? e.touches[0] : e.target;
		console.log(root);
		const xDiff = root.clientX - dragInfo.current.initCoords.x;
		const yDiff = root.clientY - dragInfo.current.initCoords.y;
		e.target.style.transform = `translate(${xDiff}px, ${yDiff}px)`;
		dragInfo.current.coords = {
			x: root.clientX,
			y: root.clientY,
		};
	};

	const stopDrag = e => {
		const {
			left: targetX,
			top: targetY,
			width: targetWidth,
			height: targetHeight,
		} = e.target.getBoundingClientRect();
		e.target.style.transform = `translate(0, 0)`;
		const { left, top, width, height } =
			dropBox.current.getBoundingClientRect();
		console.log(dragInfo.current.coords, left, top, width, height);
		if (
			targetX + targetWidth >= left &&
			targetX <= left + width &&
			targetY + targetHeight >= top &&
			targetY <= top + height
		) {
			console.log('dropping');
			dropData();
		}
	};

	const dropData = e => {
		setSplitWorkouts([...splitWorkouts, dragInfo.current.item]);
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

			<div className='split-info'>
				<div className='workouts-sequence'>
					<div className='all-workouts-field'>
						{allWorkouts.map(workout => {
							return (
								<WorkoutBox
									workout={workout}
									key={workout.id}
									// draggable='true'
									onMouseDown={e => startDragging(e, workout)}
									onMouseMove={e => moveDraggableObject(e)}
									// onTouchStart={e => startDragging(workout)}
									onTouchStart={e => startDragging(e, workout, true)}
									onTouchMove={e => moveDraggableObject(e, true)}
									onTouchEnd={e => stopDrag(e)}
									//	dropCb={dropData}
								/>
							);
						})}
					</div>

					<div
						className='split-workouts-field'
						// onDragOver={e => e.preventDefault()}
						// onDrop={dropData}
						ref={dropBox}
					>
						{splitWorkouts.map(workout => {
							return (
								<WorkoutBox
									workout={workout}
									key={uuid()}
									draggable='true'
									onDragStart={() => setShowDeleteArea(true)}
								/>
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
