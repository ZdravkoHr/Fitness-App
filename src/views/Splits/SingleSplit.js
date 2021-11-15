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
	const dragInfo = useRef({ item: null, initCoords: null, dragging: false });
	const dropBox = useRef();

	const DeleteArea = () => {
		return (
			<div className='delete-area'>
				<DeleteIcon />
			</div>
		);
	};

	const startDragging = (e, data, isTouchEvent) => {
		e.preventDefault();
		let coords;

		if (isTouchEvent) {
			coords = { x: e.touches[0].clientX, y: e.touches[0].clientY };
		} else {
			coords = {
				x: e.target.getBoundingClientRect().x,
				y: e.target.getBoundingClientRect().y,
			};
		}

		dragInfo.current = {
			data,
			item: e.target,
			initCoords: coords,
			dragging: true,
		};
	};

	const moveDraggableObject = (e, isTouchEvent) => {
		if (!dragInfo.current.dragging) return;

		const source = isTouchEvent ? e.touches[0] : e;
		const { height, width } = dragInfo.current.item.getBoundingClientRect();
		const xDiff = source.clientX - dragInfo.current.initCoords.x - width / 2;
		const yDiff = source.clientY - dragInfo.current.initCoords.y - height / 2;
		// console.log(e.clientX, e.clientY);
		dragInfo.current.item.style.transform = `translate(${xDiff}px, ${yDiff}px)`;
		// return;
		// e.preventDefault();

		// const root = isTouchEvent ? e.touches[0] : e;

		// const clientY = e.clientY;

		// console.log(e.target);

		// // e.target.style.transform = `translateY(${clientY}px)`;

		// const xDiff =
		// 	root.getBoundingClientRect().x - dragInfo.current.initCoords.x;

		// const yDiff =
		// 	root.getBoundingClientRect().y - dragInfo.current.initCoords.y;
		// e.target.style.transform = `translate(${xDiff}px, ${yDiff}px)`;
		// console.log(root.getBoundingClientRect().y, dragInfo.current.initCoords.y);

		// dragInfo.current.coords = {
		// 	x: root.getBoundingClientRect().x,
		// 	y: root.getBoundingClientRect().y,
		// };
	};

	const stopDrag = e => {
		const {
			left: targetX,
			top: targetY,
			width: targetWidth,
			height: targetHeight,
		} = e.target.getBoundingClientRect();
		dragInfo.current.item.style.transform = `translate(0, 0)`;
		dragInfo.current.dragging = false;
		const { left, top, width, height } =
			dropBox.current.getBoundingClientRect();
		// console.log(dragInfo.current.coords, left, top, width, height);
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
		setSplitWorkouts([...splitWorkouts, dragInfo.current.data]);
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

	useEffect(() => {
		document.addEventListener('mousemove', moveDraggableObject);

		return () => {
			document.removeEventListener('mousemove', moveDraggableObject);
		};
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
									draggable='true'
									onMouseDown={e => startDragging(e, workout)}
									onMouseUp={stopDrag}
									//onMouseMove={e => moveDraggableObject(e)}
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
