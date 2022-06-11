import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Close } from '@material-ui/icons';
import useOutsideClick from 'hooks/useOutsideClick';
import SidebarEl from './Sidebar.style';

const Sidebar = ({ opened, closeSidebar }) => {
	const reference = useRef();
	const clickedOutside = useOutsideClick(reference);

	useEffect(() => {
		if (clickedOutside[0] && opened) {
			closeSidebar();
		}
	}, [clickedOutside]);

	return (
		<SidebarEl className={`sidebar ${!opened && 'hidden'}`} ref={reference}>
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
				<li>
					<Link to='/diary'>Diary</Link>
				</li>
			</ul>
		</SidebarEl>
	);
};

export default Sidebar;
