import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import uuid from 'react-uuid';
import { DragDropContainer, DropTarget } from 'react-drag-drop-container';
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

	const DeleteArea = () => {
		return (
			<div className='delete-area'>
				<DeleteIcon />
			</div>
		);
	};

	const dropWorkout = e => {
		const workout = e.dragData;
		setSplitWorkouts([...splitWorkouts, workout]);
	};

	useEffect(() => {
		setAllWorkouts([restObj, ...workouts]);
	}, [workouts]);

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
								<DragDropContainer
									key={workout.id}
									dragData={workout}
									targetKey='splitworkout'
								>
									<WorkoutBox workout={workout} />
								</DragDropContainer>
							);
						})}
					</div>

					<DropTarget targetKey='splitworkout' onHit={dropWorkout}>
						<div className='split-workouts-field'>
							{splitWorkouts.map(workout => {
								return (
									<DragDropContainer
										key={uuid()}
										dragData={workout}
										targetKey='splitworkout'
									>
										<WorkoutBox workout={workout} />;
									</DragDropContainer>
								);
							})}
						</div>
					</DropTarget>
				</div>
			</div>

			{showDeleteArea && DeleteArea()}
		</SingleSplitEl>
	);
};

export default SingleSplit;
