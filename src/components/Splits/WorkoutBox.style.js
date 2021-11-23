import styled from 'styled-components';

const WorkoutBoxEl = styled.div`
	&.rest {
		position: relative;
		background-color: var(--success-color);
	}

	&.workout {
		position: relative;
		background-color: var(--dark-color);
	}

	&.rest,
	&.workout {
		border-radius: 5px;
		padding: 10px;
		cursor: pointer;
		margin-right: 5px;
		margin-bottom: 5px;
		text-transform: uppercase;
		user-select: none;
	}
`;

export const Clone = styled(WorkoutBoxEl)`
	& {
		cursor: grab;
	}
`;

export default WorkoutBoxEl;
