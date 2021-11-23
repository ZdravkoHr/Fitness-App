import WorkoutBox from 'components/Splits/WorkoutBox';
import { Droppable } from 'react-beautiful-dnd';
import uuid from 'react-uuid';

const DropArea = ({ splitWorkouts, addWorkout }) => {
	const getArea = provided => {
		return splitWorkouts.map(workout => {
			return (
				<p
					{...provided.droppableProps}
					ref={provided.innerRef}
					key={workout.sampleId}
				>
					asd
				</p>
				// <WorkoutBox
				// 	{...provided.droppableProps}
				// 	ref={provided.innerRef}
				// 	key={workout.sampleId}
				// 	workout={workout}
				// >
				// 	{provided.placeholder}
				// </WorkoutBox>
			);
		});
	};

	return (
		<Droppable droppableId={uuid()} className='split-workouts-field'>
			{provided => {
				return splitWorkouts.map(workout => {
					return (
						<div ref={provided.innerRef} key={workout.sampleId}>
							{/* <WorkoutBox {...provided.droppableProps} workout={workout}>
								{provided.placeholder}
							</WorkoutBox> */}
							text
						</div>
					);
				});
			}}
		</Droppable>
	);
};

export default DropArea;
