import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import SignForm from '../Form.style';
import Spinner from 'components/Spinner';
import { firebase, auth } from '../../firebase';
import { login } from 'store/slices/user';
import { validateEmail, validatePassword } from 'validate';
import { history } from 'helpers';
import store from 'store';
import { Email, Lock, Visibility, VisibilityOff } from '@material-ui/icons';
import { showError as activateError } from '../formFunctions';
import NotificationBox from 'components/Notifications/NotificationBox.js';
const Signin = () => {
	const dispatch = useDispatch();

	const [isLogged, setIsLogged] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [fail, setFail] = useState(false);
	const [closeTimer, setCloseTimer] = useState(null);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errorTxt, setErrorTxt] = useState('');
	const [showPassword, setShowPassword] = useState(false);

	useEffect(() => {
		if (isLogged !== undefined) {
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

	const showError = error => {
		activateError(error, setFail, setErrorTxt, setCloseTimer);
	};

	const signinWithGoogle = () => {
		const provider = new firebase.auth.GoogleAuthProvider();
		auth.signInWithRedirect(provider);
	};

	const submitHandler = async e => {
		try {
			e.preventDefault();
			closeTimer && clearTimeout(closeTimer);

			validateEmail(email);
			validatePassword(password);

			const { user } = await auth.signInWithEmailAndPassword(email, password);

			const dispatchInfo = {
				user: {
					email: user.email,
					password: user.password,
					displayName: user.displayName,
					uid: user.uid,
				},
				redirect: true,
			};

			dispatch(login(dispatchInfo));

			history.push('/');
		} catch (err) {
			showError(err);
		}
	};

	if (isLoading) {
		return <Spinner />;
	}

	return (
		<main className='signin container'>
			<div className='top'>
				<h1>Sign in</h1>
				<div className='log-icons'>
					<div className='google' onClick={signinWithGoogle}>
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

				<Link to='/resetpassword' className='forgotten-password'>
					Forgotten password?
				</Link>

				<div className='buttons'>
					<button className='btn btn-signin'>Sign in</button>
				</div>
			</SignForm>
		</main>
	);
};

export default Signin;
