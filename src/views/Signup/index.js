import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import SignForm from '../Form.style.js';
import Spinner from 'components/Spinner';
import { firebase, auth } from '../../firebase';
import { login } from 'store/slices/user';
import store from 'store';
import {
	Email,
	Lock,
	Person,
	Visibility,
	VisibilityOff,
} from '@material-ui/icons';
import { validateEmail, validatePassword, validateUsername } from 'validate';
import { history } from 'helpers';
import { showError as activateError } from '../formFunctions';
import NotificationBox from 'components/Notifications/NotificationBox.js';
const Signup = () => {
	const dispatch = useDispatch();

	const [isLogged, setIsLogged] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [fail, setFail] = useState(false);
	const [closeTimer, setCloseTimer] = useState(null);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [username, setUsername] = useState('');
	const [errorTxt, setErrorTxt] = useState('');
	const [showPassword, setShowPassword] = useState(false);

	const showError = error => {
		activateError(error, setFail, setErrorTxt, setCloseTimer);
	};

	useEffect(() => {
		if (isLogged !== undefined && isLogged !== null) {
			setIsLoading(false);
		}
		if (isLogged) {
			history.push('/');
		}
	}, [isLogged]);

	useEffect(() => {
		store.subscribe(() => {
			setIsLogged(store.getState().logged);
		});
	}, []);

	const signupWithGoogle = () => {
		const provider = new firebase.auth.GoogleAuthProvider();
		auth.signInWithRedirect(provider);
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

			const dispatchInfo = {
				user: {
					email,
					password,
					username,
				},
				redirect: true,
			};

			dispatch(dispatchInfo);
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

	if (isLoading) {
		return <Spinner />;
	}

	return (
		<main className='signup container'>
			<div className='top'>
				<h1>Sign up</h1>
				<div className='log-icons'>
					<div className='google' onClick={signupWithGoogle}>
						<i className='fab fa-google'></i>
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
				<div className='form-group'>
					<div className='input-wrapper'>
						<Lock />
						<input
							type={showPassword ? 'text' : 'password'}
							placeholder='Password'
							value={password}
							onChange={e => setPassword(e.target.value)}
						/>
						<span
							className='visibility'
							onClick={() => setShowPassword(!showPassword)}
						>
							{showPassword ? <VisibilityOff /> : <Visibility />}
						</span>
					</div>
				</div>
				<div className='form-group'>
					<div className='input-wrapper'>
						<Person />
						<input
							type='text'
							placeholder='Username'
							value={username}
							onChange={e => setUsername(e.target.value)}
						/>
					</div>
				</div>
				<div className='buttons'>
					<button className='btn btn-signup'>Sign up</button>
				</div>
			</SignForm>
		</main>
	);
};

export default Signup;
