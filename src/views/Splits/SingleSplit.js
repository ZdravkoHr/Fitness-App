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

	const DeleteArea = () => {
		return (
			<div className='delete-area'>
				<DeleteIcon />
			</div>
		);
	};

	const dropData = (e, dragInfo) => {
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

	// useEffect(() => {
	// 	document.addEventListener('mousemove', moveDraggableObject);

	// 	return () => {
	// 		document.removeEventListener('mousemove', moveDraggableObject);
	// 	};
	// }, []);

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
									dropDataCb={dropData}
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
