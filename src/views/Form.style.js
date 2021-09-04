import styled from 'styled-components';

const SignForm = styled.form`
	& {
		max-width: 600px;
		margin: auto;
		background-color: #fff;
		padding: 14px;
	}

	.forgotten-password {
		display: block;
		color: #2e2a2a;
		text-align: center;
		cursor: pointer;
		margin: 10px 0;
	}

	.form-group {
		margin-bottom: 20px;
	}

	.input-wrapper {
		display: flex;
		align-items: center;
		border: 1px solid #ccc;
		margin-bottom: 10px;
		padding-left: 10px;
		svg {
			fill: #bababa;
		}

		.visibility {
			cursor: pointer;
			padding-right: 5px;
			margin-left: 5px;
			display: flex;
			align-items: center;
		}
	}

	input {
		display: block;
		width: 100%;
		padding: 10px;
		padding-left: 5px;
		background: transparent;
		border: 0;
		outline: none;
	}

	.buttons .btn {
		width: 100%;
		background: #000;
		color: #fff;
		border-radius: 5px;
		font-size: 16px;
		border: 2px solid #000;
		transition: 0.5s;
		outline: none;

		&:hover {
			background-color: transparent;
			color: #000;
		}
	}
`;

export default SignForm;
