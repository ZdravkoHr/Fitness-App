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

	const addSplitWorkout = id => {
		console.log(allWorkouts, id);
		const workout = allWorkouts.find(workout => workout.id === id);
		setSplitWorkouts(workouts => {
			return [...workouts, { ...workout, sampleId: uuid() }];
		});
	};

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
							addWorkout={addSplitWorkout}
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
