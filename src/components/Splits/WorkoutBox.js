import WorkoutBoxEl from './WorkoutBox.style';
import { useDrag } from 'react-dnd';
const WorkoutBox = ({ workout, ...rest }) => {
	const { isRest } = workout;

	const [{ isDragging }, drag] = useDrag(() => ({
		type: 'workout',
		item: { id: workout.id },
		collect: monitor => ({
			isDragging: !!monitor.isDragging(),
		}),
	}));

	return (
		<WorkoutBoxEl
			ref={drag}
			className={`${isRest ? 'rest' : 'workout'}`}
			{...rest}
		>
			{workout.name}
		</WorkoutBoxEl>
	);
};

export default WorkoutBox;
