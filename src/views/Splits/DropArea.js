import { useDrop } from 'react-dnd';
import WorkoutBox from 'components/Splits/WorkoutBox';

const DropArea = ({ splitWorkouts, addWorkout }) => {
	const [, dropBox] = useDrop(
		() => ({
			accept: 'workout',
			drop: ({ id }) => addWorkout(id),
		}),
		[addWorkout]
	);
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
