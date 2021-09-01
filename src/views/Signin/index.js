import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import SignForm from '../Form.style';
import { firebase, auth } from '../../firebase';
import { login } from 'store/slices/user';
import { validateEmail, validatePassword } from 'validate';
import NotificationBox from 'components/Notifications/NotificationBox.js';
const Signup = () => {
	const NOTIFICATION_CLOSE_TIME = 2000;
	const dispatch = useDispatch();
	const history = useHistory();

	const [fail, setFail] = useState(false);
	const [closeTimer, setCloseTimer] = useState(null);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errorTxt, setErrorTxt] = useState('');

	const showError = error => {
		setFail(true);
		setErrorTxt(error.message);
		const closeTimer = setTimeout(() => {
			setFail(false);
		}, NOTIFICATION_CLOSE_TIME);

		setCloseTimer(closeTimer);
	};

	const googleSignup = async () => {
		const provider = new firebase.auth.GoogleAuthProvider();
		await auth.signInWithRedirect(provider);
		history.push('/');
	};

	const submitHandler = async e => {
		try {
			e.preventDefault();
			closeTimer && clearTimeout(closeTimer);

			validateEmail(email);
			validatePassword(password);

			const { user } = await auth.signInWithEmailAndPassword(email, password);
			dispatch(
				login({
					email: user.email,
					password: user.password,
					displayName: user.displayName,
					uid: user.uid,
				})
			);

			history.push('/');
		} catch (err) {
			showError(err);
		}
	};

	return (
		<main className='signin container'>
			<div className='top'>
				<h1>Sign in</h1>
				<div className='log-icons'>
					<div className='google' onClick={googleSignup}>
						<i class='fab fa-google'></i>
					</div>
				</div>
			</div>
			<NotificationBox
				text={errorTxt}
				active={fail}
				fail={true}
				closeCb={() => setFail(false)}
			/>
			<SignForm onSubmit={submitHandler}>
				<div className='form-group'>
					<input
						type='email'
						placeholder='Email address'
						value={email}
						onChange={e => setEmail(e.target.value)}
					/>
				</div>
				<div className='form-group'>
					<input
						type='password'
						placeholder='Password'
						value={password}
						onChange={e => setPassword(e.target.value)}
					/>
				</div>

				<div className='buttons'>
					<button className='btn btn-signin'>Sign in</button>
				</div>
			</SignForm>
		</main>
	);
};

export default Signup;
