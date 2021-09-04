import { Menu } from '@material-ui/icons';
import { auth } from '../../firebase';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from 'store/slices/user';
import NavBarEl from './Navbar.style';

const Navbar = ({ openSidebar }) => {
	const dispatch = useDispatch();
	const { pathname: route } = useLocation();
	const user = auth.currentUser;

	const signHandler = () => {
		if (user) {
			auth.signOut();
			dispatch(logout());
		}
	};

	return (
		<NavBarEl className='main-nav'>
			<div className='open-sidebar'>
				<Menu onClick={openSidebar} />
			</div>
			<ul className='menu-items'>
				<li
					className={`sign-in-out-button ${
						route === '/signin' && !user ? 'active' : ''
					}`}
				>
					<Link to='/signin' onClick={signHandler}>
						{user ? 'Sign out' : 'Sign in'}
					</Link>
				</li>

				{!user && (
					<li
						className={`signup-button ${route === '/signup' ? 'active' : ''}`}
					>
						<Link to='/signup'>Sign up</Link>
					</li>
				)}
			</ul>
		</NavBarEl>
	);
};

export default Navbar;
