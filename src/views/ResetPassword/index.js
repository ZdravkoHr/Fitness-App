import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import SignForm from '../Form.style';
import { auth } from '../../firebase';
import { validateEmail } from 'validate';
import { Email, CheckCircle } from '@material-ui/icons';
import { showError as activateError } from '../formFunctions';
import NotificationBox from 'components/Notifications/NotificationBox.js';
const ResetPassword = () => {
	const dispatch = useDispatch();

	const [success, setSuccess] = useState(false);
	const [fail, setFail] = useState(false);
	const [closeTimer, setCloseTimer] = useState(null);
	const [email, setEmail] = useState('');
	const [errorTxt, setErrorTxt] = useState('');

	const showError = error => {
		activateError(error, setFail, setErrorTxt, setCloseTimer);
	};

	const FormElements = () => {
		return (
			<>
				<div className='form-group'>
					<div className='input-wrapper'>
						<Email />
						<input
							type='email'
							placeholder='Email address'
							value={email}
							onChange={e => setEmail(e.target.value)}
						/>
					</div>
				</div>

				<div className='buttons'>
					<button className='btn btn-resetpassword'>Reset Password</button>
				</div>
			</>
		);
	};

	const submitHandler = async e => {
		try {
			e.preventDefault();
			closeTimer && clearTimeout(closeTimer);
			validateEmail(email);
			await auth.sendPasswordResetEmail(email);
			setSuccess(true);
		} catch (err) {
			showError(err);
		}
	};

	return (
		<main className='signin container'>
			<div className='top'>
				<h1>Reset your password</h1>
			</div>
			<NotificationBox
				text={errorTxt}
				active={fail}
				fail={true}
				closeCb={() => setFail(false)}
			/>
			<SignForm onSubmit={submitHandler}>
				{success ? (
					<div
						style={{
							color: 'green',
							textAlign: 'center',
							lineHeight: '50px',
							fontSize: '25px',
						}}
					>
						<p>We have sent you a password reset email.</p>
						<CheckCircle style={{ width: '150px', height: '150px' }} />
					</div>
				) : (
					FormElements()
				)}
			</SignForm>
		</main>
	);
};

export default ResetPassword;
