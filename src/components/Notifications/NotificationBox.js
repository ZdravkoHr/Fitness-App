import React from 'react';
import NotificationBoxEl from './NotificationBox.style';

const NotificationBox = ({ active, fail, text }) => {
	return (
		<NotificationBoxEl
			className={`container notification-box ${active ? 'active' : ''} ${
				fail ? 'fail' : ''
			}`}
		>
			<h2>{text}</h2>
		</NotificationBoxEl>
	);
};

export default NotificationBox;
