import { useState, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import WorkoutBox from 'components/Splits/WorkoutBox';

const DropArea = ({ splitWorkouts, addWorkout }) => {
	const [test, setTest] = useState(0);

	const handler = workout => {
		console.log('test: ', test);
		addWorkout(workout);
		setTest(test => test + 1);
	};

	useEffect(() => {
		console.log('test: ', test);
	}, [test]);

	const [, dropBox] = useDrop(() => ({
		accept: 'workout',
		drop: workout => handler(workout),
	}));
	return (
		<div className='split-workouts-field' ref={dropBox}>
			{splitWorkouts.map(workout => {
				return (
					// <DragObject
					// 	key={workout.sampleId}
					// 	data-key={workout.sampleId}
					// 	dragData={workout}
					// 	dropBoxes={[deleteArea]}
					// 	startCb={() => setShowDeleteArea(true)}
					// 	moveCb={moveHandler}
					// 	endCb={splitDragEndHandler}
					// 	dropCb={removeWorkout}
					// 	className='drag-object'
					// >
					<WorkoutBox key={workout.sampleId} workout={workout} />
					// </DragObject>
				);
			})}
		</div>
	);
};

export default DropArea;
