import WorkoutBoxEl from './WorkoutBox.style';

const WorkoutBox = ({ innerRef, workout, ...rest }) => {
	const { isRest } = workout;
	return (
		<WorkoutBoxEl className={`${isRest ? 'rest' : 'workout'}`} {...rest}>
			{workout.name}
		</WorkoutBoxEl>
	);
};

export default WorkoutBox;
