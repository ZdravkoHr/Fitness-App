import { useEffect, useState } from 'react';
import Item from './FakeItem.style';

const FakeItem = ({ x, y, dragging, id, children, ...rest }) => {
	const [initCoords, setInitCoords] = useState({});

	const getStyle = () => {
		console.log(x, initCoords.x);
		const newX = x - initCoords.x - initCoords.width / 2;
		const newY = y - initCoords.y - initCoords.height / 2;

		return {
			transform: `translate(${newX}px, ${newY}px)`,
			opacity: '0.9',
			zIndex: '11',
		};
	};

	const styleObj = dragging ? getStyle(x, y, id) : {};

	useEffect(() => {
		setInitCoords(document.getElementById(id).getBoundingClientRect());
	}, []);

	return (
		<Item className='fake' id={id} style={styleObj} {...rest}>
			{children}
		</Item>
	);
};

export default FakeItem;
