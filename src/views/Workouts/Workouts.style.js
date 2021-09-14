import styled from 'styled-components';

const Workouts = styled.main`
	h1 {
		padding-bottom: 20px;
		text-align: center;
	}

	.top {
		display: flex;
		justify-content: space-between;
	}

	.workout-boxes {
		display: flex;
		padding: 1rem 0;
	}

	.single-workout {
		background-color: #464646;
		padding: 18px 20px;
		border-radius: 10px;
		text-transform: uppercase;
		margin-right: 5px;
		position: relative;
		cursor: pointer;

		&:hover {
			.close-icon {
				display: block;
			}
		}

		.close-icon {
			position: absolute;
			right: 0;
			top: 0;
			font-size: 18px;
			cursor: pointer;
			border-radius: 50% 10px 0px 50%;
			padding: 1px 5px;
			display: none;
			user-select: none;

			&:hover {
				background-color: #fff;
				color: #000;
			}
		}
	}
`;

export default Workouts;
