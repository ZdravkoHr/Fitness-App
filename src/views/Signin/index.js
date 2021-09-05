import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import SignForm from '../Form.style';
import { firebase, auth } from '../../firebase';
import { login } from 'store/slices/user';
import { validateEmail, validatePassword } from 'validate';
import { redirectIfLogged } from 'helpers';
import { Email, Lock, Visibility, VisibilityOff } from '@material-ui/icons';
import { showError as activateError } from '../formFunctions';
import NotificationBox from 'components/Notifications/NotificationBox.js';
const Signin = () => {
	const dispatch = useDispatch();
	const history = useHistory();

	const [fail, setFail] = useState(false);
	const [closeTimer, setCloseTimer] = useState(null);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errorTxt, setErrorTxt] = useState('');
	const [showPassword, setShowPassword] = useState(false);

	useEffect(() => {
		redirectIfLogged();
	}, []);

	const showError = error => {
		activateError(error, setFail, setErrorTxt, setCloseTimer);
	};

	useEffect(() => {
		try {
			redirectIfLogged();
		} catch (err) {
			showError(err);
		}
	}, []);

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
