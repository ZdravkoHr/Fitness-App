import { useState, useRef, useEffect } from 'react';
import uuid from 'react-uuid';
// import FakeItem from './FakeItem';

const DragObject = ({
	dropBoxes,
	startCb,
	moveCb,
	endCb,
	dropCb,
	dragData,
	children,
	className,
	index,
	...rest
}) => {
	const initDragInfo = { item: null, initCoords: null, dragging: false };

	const dragInfo = useRef({ ...initDragInfo });
	const dragObject = useRef();
	const fakeId = useRef(uuid());

	const [prevClientCoords, setPrevClientCoords] = useState({});
	const [clientCoords, setClientCoords] = useState({});
	const [moveSource, setMoveSource] = useState(null);
	const [dragging, setDragging] = useState(false);
	const [initCoords, setInitCoords] = useState({});

	const isColliding = item => {
		return item2 => {
			const {
				left: targetX,
				top: targetY,
				width: targetWidth,
				height: targetHeight,
			} = item.getBoundingClientRect();

			const { left, top, width, height } = item2.getBoundingClientRect();
			if (
				targetX + targetWidth >= left &&
				targetX <= left + width &&
				targetY + targetHeight >= top &&
				targetY <= top + height
			) {
				return true;
			}

			return false;
		};
	};

	const getTranslateXValue = el => {
		const str = el.style.transform;
		const lastSymbol = str.includes('X') ? ')' : ',';
		const startIndex = str.indexOf('(') + 1;
		const endIndex = str.indexOf(lastSymbol);
		const pxValue = str.slice(startIndex, endIndex);
		const numValue = Number(pxValue.slice(0, -2));

		return { pxValue, numValue };
	};

	// const renderFakeItem = () => {
	// 	return (
	// 		<FakeItem
	// 			dragging={dragging}
	// 			x={clientCoords.x}
	// 			y={clientCoords.y}
	// 			id={fakeId.current}
	// 			onMouseDown={e => startDragging(e, dragData)}
	// 			onTouchStart={e => startDragging(e, dragData, true)}
	// 			onTouchMove={e => moveDraggableObject(e, true)}
	// 			onMouseUp={stopDrag}
	// 			onTouchEnd={stopDrag}
	// 		>
	// 			{children}
	// 		</FakeItem>
	// 	);
	// };

	const clearDragElement = () => {
		if (!dragInfo.current.item) return;

		dragInfo.current.item.style.transform = `translate(0, 0)`;
		dragInfo.current.dragging = false;
		document.removeEventListener('mousemove', moveDraggableObject);
		document.body.removeEventListener('mouseleave', clearDragElement);
	};

	const getStyles = () => {
		if (!dragging) return;
		const { numValue } = getTranslateXValue(dragObject.current);
		const prevVal = prevClientCoords.x || initCoords.x;
		const newX = clientCoords.x;
		const newY = clientCoords.y - initCoords.y - initCoords.height / 2;
		//console.log(prevClientCoords, prevVal, clientCoords.x - prevVal);
		return {
			transform: `translate(${
				numValue + clientCoords.x - prevVal
			}px, ${newY}px)`,
			opacity: '0.9',
			zIndex: '11',
		};
	};

	const startDragging = (e, data, isTouchEvent) => {
		e.preventDefault();
		setDragging(true);
		let coords;

		setMoveSource(isTouchEvent ? e.touches[0] : e);

		if (isTouchEvent) {
			coords = { x: e.touches[0].clientX, y: e.touches[0].clientY };
		} else {
			coords = {
				x: e.target.getBoundingClientRect().x,
				y: e.target.getBoundingClientRect().y,
			};

			document.addEventListener('mousemove', moveDraggableObject);
		}

		dragInfo.current = {
			data,
			item: e.target,
			initCoords: coords,
			dragging: true,
		};
		dragObject.current.classList.add('dragging');

		setClientCoords({ x: e.clientX, y: e.clientY });

		document.body.addEventListener('mouseleave', clearDragElement);
		startCb && startCb(dragInfo.current);
	};

	const moveDraggableObject = (e, isTouchEvent) => {
		if (!dragInfo.current.dragging) return;
		//const source = isTouchEvent ? e.touches[0] : e;
		//console.log('updating', { ...clientCoords });

		setPrevClientCoords({ ...clientCoords });

		moveCb && moveCb(e, { isColliding, dragInfo });
	};

	useEffect(() => {
		if (!moveSource) return;
		console.log(prevClientCoords);
		setClientCoords({ x: moveSource.clientX, y: moveSource.clientY });
	}, [prevClientCoords]);

	const stopDrag = e => {
		const isDroppable = isColliding(e.target);

		for (const dropBox of dropBoxes) {
			if (!isDroppable(dropBox.current)) continue;

			dropCb && dropCb(e, dragInfo);
			break;
		}

		setDragging(false);
		dragObject.current.classList.remove('dragging');
		endCb && endCb(e);
		clearDragElement();
		document.body.removeEventListener('mouseleave', clearDragElement);
	};

	useEffect(() => {
		setInitCoords(dragObject.current.getBoundingClientRect());
	}, [index]);

	// useEffect(() => {
	// 	const dragClass = dragInfo.current.dragging ? 'dragging ' : '';
	// 	setItemClass(dragClass + className);
	// }, [showFake]);

	return (
		<>
			<div
				className={className}
				ref={dragObject}
				onMouseDown={e => startDragging(e, dragData)}
				onTouchStart={e => startDragging(e, dragData, true)}
				onTouchMove={e => moveDraggableObject(e, true)}
				onMouseUp={stopDrag}
				onTouchEnd={stopDrag}
				style={getStyles()}
			>
				{/* {renderFakeItem()} */}
				{children}
			</div>
		</>
	);
};

export { DragObject };
