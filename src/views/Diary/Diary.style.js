import styled from 'styled-components';

const DiaryEl = styled.section`
	.diary-holder {
		background: #fff;
		border-radius: 8px;
		padding: 2rem;
		margin-block: 1.5rem;
		color: #000;
		max-height: 400px;
		overflow-y: auto;
	}

	.workout {
		margin-block: 1rem;
		border-bottom: 1px dashed #000;
		padding-bottom: 1rem;
	}

	.workout-name-row {
		line-height: 1.6;
	}

	th {
		text-align: left;
		width: 150px;
	}

	tr {
		border-bottom: 1px solid black;
		display: block;
	}

	td {
		padding: 1rem;
		width: 150px;
	}

	table {
		border-collapse: collapse;
		display: block;

		margin-top: 1rem;

		.exercise-name {
			width: 300px;
		}
	}
`;

export default DiaryEl;
