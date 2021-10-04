import styled from 'styled-components';

const SingleSplitEl = styled.main`
	.workouts-sequence {
		margin: 15px 0;
	}

	.all-workouts-field,
	.split-workouts-field {
		min-height: 80px;
		margin-bottom: 30px;
		background: #fff;
		border-radius: 5px;
		padding: 8px 14px;
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
	}

	.rest {
		background-color: var(--success-color);
	}

	.workout {
		background-color: var(--dark-color);
	}

	.rest,
	.workout {
		border-radius: 5px;
		padding: 10px;
		cursor: pointer;
		margin-right: 5px;
		margin-bottom: 5px;
		text-transform: uppercase;
		user-select: none;
	}
`;

export default SingleSplitEl;
