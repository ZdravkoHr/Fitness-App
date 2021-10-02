import { useEffect, useRef } from 'react';
import NotificationBoxEl from './NotificationBox.style';

const NotificationBox = ({
	active,
	fail,
	text,
	closeCb,
	closingTimer = 2000,
}) => {
	const timerRef = useRef();

	useEffect(() => {
		if (!active) return;

		timerRef.current = setTimeout(closeCb, 3000);

		return () => {
			timerRef.current && clearTimeout(timerRef.current);
		};
	}, [active, text]);

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
