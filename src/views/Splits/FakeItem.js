import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { dragSelector } from 'store';
import Item from './FakeItem.style';

const FakeItem = ({
	dragInfo,

	children,
	...rest
}) => {
	const { clientCoords, initCoords, dragID } = useSelector(dragSelector);
	const fakeRef = useRef();
	const [startCoords, setStartCoords] = useState({});
	const [loading, setLoading] = useState(true);
	const [styles, setStyles] = useState({});

	useEffect(() => {
		const dragObject = document.getElementById(dragID);
		const { x: objX, y: objY } = dragObject.getBoundingClientRect();
		const { x: fakeX, y: fakeY } = fakeRef.current.getBoundingClientRect();

		setStartCoords({ x: objX - fakeX, y: objY - fakeY });
	}, []);

	useEffect(() => {
		if (startCoords.x) setLoading(false);
	}, [startCoords]);

	useEffect(() => {
		if (loading) {
			setStyles({ opacity: '0' });
			return;
		}

		const clientCoordsObj = clientCoords.x ? clientCoords : initCoords;

		const x = startCoords.x + clientCoordsObj.x - initCoords.x;
		const y = startCoords.y + clientCoordsObj.y - initCoords.y;

		const newStyles = {
			transform: `translate(${x}px, ${y}px)`,
			opacity: '0.9',
			zIndex: '11',
		};

		setStyles(newStyles);
	}, [loading, clientCoords]);

	return (
		<Item
			className='fake'
			style={styles}
			ref={fakeRef}
			id='fake-drag-item'
			{...rest}
		>
			{children}
		</Item>
	);
};

export default FakeItem;
