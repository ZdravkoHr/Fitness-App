import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import SignForm from '../Form.style.js';
import { firebase, auth } from '../../firebase';
import { login } from 'store/slices/user';
import { validateEmail, validatePassword, validateUsername } from 'validate';
import NotificationBox from 'components/Notifications/NotificationBox.js';
const Signup = () => {
	const NOTIFICATION_CLOSE_TIME = 2000;
	const dispatch = useDispatch();
	const history = useHistory();

	const [fail, setFail] = useState(false);
	const [closeTimer, setCloseTimer] = useState(null);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [username, setUsername] = useState('');
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

	const registerUser = async () => {
		setFail(true);
		try {
			const { user } = await auth.createUserWithEmailAndPassword(
				email,
				password
			);
			await user.updateProfile({
				displayName: username,
			});

			dispatch(
				login({
					email,
					password,
					username,
				})
			);

			history.push('/');
		} catch (err) {
			showError(err);
		}
	};

	const submitHandler = e => {
		try {
			e.preventDefault();
			closeTimer && clearTimeout(closeTimer);

			validateEmail(email);
			validatePassword(password);
			validateUsername(username);
			registerUser();
		} catch (err) {
			showError(err);
		}
	};

	return (
		<main className='signup container'>
			<div className='top'>
				<h1>Sign up</h1>
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
				<div className='form-group'>
					<input
						type='text'
						placeholder='Username'
						value={username}
						onChange={e => setUsername(e.target.value)}
					/>
				</div>
				<div className='buttons'>
					<button className='btn btn-signup'>Sign up</button>
				</div>
			</SignForm>
		</main>
	);
};

export default Signup;