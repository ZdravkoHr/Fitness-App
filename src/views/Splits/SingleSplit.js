import { useState, useEffect } from 'react';
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

	const startDragging = (e, id) => {
		e.dataTransfer.setData('id', id);
	};

	const dropData = e => {
		const id = e.dataTransfer.getData('id');
		const workout = allWorkouts.find(workout => workout.id === id);

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
								<WorkoutBox
									workout={workout}
									key={workout.id}
									draggable='true'
									onDragStart={e => startDragging(e, workout.id)}
								/>
							);
						})}
					</div>

					<div
						className='split-workouts-field'
						onDragOver={e => e.preventDefault()}
						onDrop={dropData}
					>
						{splitWorkouts.map(workout => {
							return <WorkoutBox workout={workout} key={uuid()} />;
						})}
					</div>
				</div>
			</div>

			<div className='delete-area'>
				<DeleteIcon />
			</div>
		</SingleSplitEl>
	);
};

export default SingleSplit;
