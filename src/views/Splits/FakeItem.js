import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { dragSelector } from 'store';
import Item from './FakeItem.style';

const FakeItem = ({
	dragInfo,

	children,
	...rest
}) => {
	const { clientCoords, initCoords } = useSelector(dragSelector);

	const getStyle = () => {
		// console.log(x, initCoords.x);
		// const newX = x - initCoords.x - initCoords.width / 2;
		// const newY = y - initCoords.y - initCoords.height / 2;
		console.log(clientCoords, initCoords);
		const x = clientCoords.x - initCoords.x;
		const y = clientCoords.y - initCoords.y;

		console.log(x, y);

		return {
			transform: `translate(${x}px, ${y}px)`,
			opacity: '0.9',
			zIndex: '11',
		};
	};

	return (
		<Item className='fake' style={getStyle()} {...rest}>
			{children}
		</Item>
	);
};

export default FakeItem;
