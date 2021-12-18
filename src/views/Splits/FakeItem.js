import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateFake } from 'store/slices/drag';
import { dragSelector } from 'store';
import Item from './FakeItem.style';

const FakeItem = ({ test, children, ...rest }) => {
	const { clientCoords, initCoords, dragID } = useSelector(dragSelector);
	const dispatch = useDispatch();
	const fakeRef = useRef();
	const [startCoords, setStartCoords] = useState({});
	const [loading, setLoading] = useState(true);
	const [styles, setStyles] = useState({});

	useEffect(() => {
		const dragObject = document.getElementById(dragID);
		const { x: objX, y: objY } = dragObject.getBoundingClientRect();
		const {
			x: fakeX,
			y: fakeY,
			width,
			height,
		} = fakeRef.current.getBoundingClientRect();
		const fakeCoords = { x: objX - fakeX, y: objY - fakeY, width, height };

		setStartCoords(fakeCoords);
		dispatch(updateFake({ fakeCoords }));
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

		test({ x, y });

		dispatch(updateFake({ x, y }));
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
