import styled from 'styled-components';

const SignupForm = styled.form`
	& {
		max-width: 600px;
		margin: auto;
	}

	.form-group {
		margin-bottom: 20px;

		.invalid {
			color: #b3a6a6;
			font-size: 14px;
		}
	}

	input {
		display: block;
		width: 100%;
		padding: 10px;
		margin-bottom: 10px;
		border: 0;
	}

	.btn-signup {
		width: 100%;
		background: #000;
		color: #fff;
		border-radius: 15px;
		font-size: 16px;
	}
`;

export default SignupForm;
