import WorkoutBox from 'components/Splits/WorkoutBox';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import uuid from 'react-uuid';

const DropArea = ({ splitWorkouts, addWorkout }) => {
	return (
		<Droppable
			droppableId='split-workouts'
			type='workout'
			className='split-workouts-field'
			direction='vertical'
		>
			{provided => {
				return (
					<div
						ref={provided.innerRef}
						{...provided.droppableProps}
						className='split-workouts-field'
					>
						{splitWorkouts.map((workout, index) => {
							return (
								<Draggable
									key={workout.sampleId}
									draggableId={workout.sampleId}
									index={index}
								>
									{provided => {
										return (
											<div
												ref={provided.innerRef}
												{...provided.draggableProps}
												{...provided.dragHandleProps}
												type='workout'
											>
												<WorkoutBox workout={workout} />
											</div>
										);
									}}
								</Draggable>
							);
						})}

						{provided.placeholder}
					</div>
				);
			}}
		</Droppable>
	);
};

export default DropArea;

// {splitWorkouts.map(workout => {
// 	return (

// 			{splitWorkouts.map((workout, index) => {
// 				return (
//
// 				);
// 			})}

// 	);
// })}
