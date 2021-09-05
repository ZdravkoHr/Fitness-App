import { Link } from 'react-router-dom';
import { Close } from '@material-ui/icons';
import SidebarEl from './Sidebar.style';

const Sidebar = ({ opened, closeSidebar }) => {
	return (
		<SidebarEl className={`sidebar ${!opened && 'hidden'}`}>
			<div className='close-sidebar'>
				<Close onClick={closeSidebar} />
			</div>
			<ul className='links'>
				<li>
					<Link to='/'>Home</Link>
				</li>{' '}
				<li>
					<Link to='/workouts'>Workouts</Link>
				</li>
			</ul>
		</SidebarEl>
	);
};

export default Sidebar;
