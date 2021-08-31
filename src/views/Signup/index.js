import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import SignupForm from './Signup.style.js';
import { auth } from '../../firebase';
import { login } from 'store/slices/user';
import { validateEmail, validatePassword, validateUsername } from 'validate';
const Signup = () => {
	const dispatch = useDispatch();
	const history = useHistory();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [username, setUsername] = useState('');
	const [invalidTxt, setInvalidTxt] = useState({
		email: '',
		password: '',
		username: '',
	});

	const registerUser = async () => {
		const { user } = await auth.createUserWithEmailAndPassword(email, password);
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
	};

	const submitHandler = e => {
		try {
			e.preventDefault();
			validateEmail(email);
			validatePassword(password);
			validateUsername(username);
			setInvalidTxt({
				email: '',
				password: '',
				username: '',
			});
			registerUser();
		} catch (err) {
			const { message, cause } = err;
			setInvalidTxt({
				...invalidTxt,
				[cause]: message,
			});
		}
	};

	return (
		<main className='signup container'>
			<SignupForm onSubmit={submitHandler}>
				<div className='form-group'>
					<input
						type='email'
						placeholder='Email address'
						value={email}
						onChange={e => setEmail(e.target.value)}
					/>
					<p className='invalid'>{invalidTxt.email}</p>
				</div>
				<div className='form-group'>
					<input
						type='password'
						placeholder='Password'
						value={password}
						onChange={e => setPassword(e.target.value)}
					/>
					<p className='invalid'>{invalidTxt.password}</p>
				</div>
				<div className='form-group'>
					<input
						type='text'
						placeholder='Username'
						value={username}
						onChange={e => setUsername(e.target.value)}
					/>
					<p className='invalid'>{invalidTxt.username}</p>
				</div>
				<div className='buttons'>
					<button className='btn btn-signup'>Sign up</button>
				</div>
			</SignupForm>
		</main>
	);
};

export default Signup;
