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
		position: relative;
		background-color: var(--success-color);
	}

	.workout {
		position: relative;
		background-color: var(--dark-color);
	}

	.current-drag {
		z-index: 7;
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

	.delete-area {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(243, 57, 57, 0.6);
		height: 130px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
`;

export default SingleSplitEl;
