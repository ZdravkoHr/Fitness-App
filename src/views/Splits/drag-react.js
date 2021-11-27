import { useState, useRef, useEffect } from 'react';

const DragObject = ({
	dropBoxes,
	startCb,
	moveCb,
	endCb,
	dropCb,
	dragData,
	children,
	className,
	...rest
}) => {
	const initDragInfo = { item: null, initCoords: null, dragging: false };
	const dragInfo = useRef({ ...initDragInfo });
	const [showFake, setShowFake] = useState(false);
	const [clientCoords, setClientCoords] = useState({});
	const [itemClass, setItemClass] = useState(className);

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

	const FakeItem = () => {
		return (
			<div
				style={{
					position: 'absolute',
					top: clientCoords.y,
					left: clientCoords.x,
					transform: 'translate(-50%, -50%)',
					zIndex: '10',
				}}
				onMouseUp={stopDrag}
			>
				{children}
			</div>
		);
	};

	const clearDragElement = () => {
		if (!dragInfo.current.item) return;

		dragInfo.current.item.style.transform = `translate(0, 0)`;
		dragInfo.current.dragging = false;
		document.removeEventListener('mousemove', moveDraggableObject);
		document.body.removeEventListener('mouseleave', clearDragElement);
	};

	const startDragging = (e, data, isTouchEvent) => {
		e.preventDefault();

		setShowFake(true);
		let coords;

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

		setClientCoords({ x: e.clientX, y: e.clientY });

		document.body.addEventListener('mouseleave', clearDragElement);
		startCb && startCb(dragInfo.current);
	};

	const moveDraggableObject = (e, isTouchEvent) => {
		if (!dragInfo.current.dragging) return;
		const source = isTouchEvent ? e.touches[0] : e;
		setClientCoords({ x: source.clientX, y: source.clientY });
		moveCb && moveCb(e, { isColliding, dragInfo });
	};

	const stopDrag = e => {
		const isDroppable = isColliding(e.target);

		for (const dropBox of dropBoxes) {
			console.log(isDroppable(dropBox.current));
			if (!isDroppable(dropBox.current)) continue;

			dropCb && dropCb(e, dragInfo);
			break;
		}

		endCb && endCb(e);
		clearDragElement();
		document.body.removeEventListener('mouseleave', clearDragElement);
		setShowFake(false);
	};

	useEffect(() => {
		const dragClass = dragInfo.current.dragging ? 'dragging ' : '';
		setItemClass(dragClass + className);
	}, [showFake]);

	return (
		<>
			{showFake && FakeItem()}
			<div
				onMouseDown={e => startDragging(e, dragData)}
				onTouchStart={e => startDragging(e, dragData, true)}
				onTouchMove={e => moveDraggableObject(e, true)}
				className={itemClass}
			>
				{children}
			</div>
		</>
	);
};

export { DragObject };
