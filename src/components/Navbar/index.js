import { Menu } from '@material-ui/icons';
import { Link, useLocation } from 'react-router-dom';
import NavBarEl from './Navbar.style';

const Navbar = ({ openSidebar }) => {
	const { pathname: route } = useLocation();

	return (
		<NavBarEl className='main-nav'>
			<div className='open-sidebar'>
				<Menu onClick={openSidebar} />
			</div>
			<ul className='menu-items'>
				<li className={`signin-button ${route === 'signin' ? 'active' : ''}`}>
					<Link to='/signin'>Sign in</Link>
				</li>
				<li className={`signup-button ${route === 'signup' ? 'active' : ''}`}>
					<Link to='/signup'>Sign up</Link>
				</li>
			</ul>
		</NavBarEl>
	);
};

export default Navbar;
