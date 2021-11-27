import { useState, useRef, useEffect } from 'react';




const DragObject = ({
	dropBoxes,
	startCb,
	moveCb,
	endCb,
	dropCb,
	dragData,
	children,
	...rest
}) => {
	const initDragInfo = { item: null, initCoords: null, dragging: false };
	const dragInfo = useRef({ ...initDragInfo });
	const [showFake, setShowFake] = useState(false);
	const [clientCoords, setClientCoords] = useState({});
	const [dragging, setDragging] = useState(false);
	const startEvent = useRef(null);
	const isTouchEvent = useRef(false);

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

	useEffect(() => {
		document.body.addEventListener('mouseup', e => {
			console.log(dragging)
			if (dragging) stopDrag(e);
		})
	}, [])



	const FakeItem = () => {
		// return <div {...rest} style={{position: 'absolute', top: dragInfo.clientCoords.y, left: dragInfo.clientCoords.x, transform: 'trasnlate(-50%, -50%)'}}>
		// {children}</div>
		return <div style={{position: 'absolute', top: clientCoords.y, left: clientCoords.x}} >
			{children}
		</div>
}

	const clearDragElement = () => {
		if (!dragInfo.current.item) return;
		dragInfo.current.item.classList.remove('current-drag');
		dragInfo.current.item.style.transform = `translate(0, 0)`;
		setDragging(false);
		document.removeEventListener('mousemove', moveDraggableObject);
		document.body.removeEventListener('mouseleave', clearDragElement);
	};

	const startDragging = (e, data, isTouchEvent) => {
		e.preventDefault();
		console.log('start')
		
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

		e.target.classList.add('current-drag');
	
		dragInfo.current = {
			data,
			item: e.target,
			initCoords: coords,
			
			
		};

		setClientCoords({x: e.clientX, y: e.clientY});

		document.body.addEventListener('mouseleave', clearDragElement);
		startCb && startCb(dragInfo.current);
	};

	const moveDraggableObject = (e, isTouchEvent) => {
		console.log(dragging)
		if (!dragging) return;
		

		const source = isTouchEvent ? e.touches[0] : e;
		// const { height, width } = dragInfo.current.item.getBoundingClientRect();
		// const xDiff = source.clientX - dragInfo.current.initCoords.x - width / 2;
		// const yDiff = source.clientY - dragInfo.current.initCoords.y - height / 2;
		// dragInfo.current.item.style.transform = `translate(${xDiff}px, ${yDiff}px)`;
		setClientCoords({x: source.clientX, y: source.clientY});

		moveCb && moveCb(e, { isColliding, dragInfo });
	};

	useEffect(() => {
		if (dragging) {
			startDragging(startEvent, dragData);
		}
	}, [dragging])

	const stopDrag = e => {
		const isDroppable = isColliding(e.target);
		console.log('stopDrag')

		for (const dropBox of dropBoxes) {
			if (!isDroppable(dropBox.current)) continue;

			dropCb && dropCb(e, dragInfo);
			break;
		}
		endCb && endCb(e);
		clearDragElement();
		document.body.removeEventListener('mouseleave', clearDragElement);
		setShowFake(false);
	};

	return (
		<>
		{showFake && FakeItem()}
		<div
			//onMouseDown={e => startDragging(e, dragData)}
			onMouseDown={() => setDragging(true)}
			onTouchStart={e => startDragging(e, dragData, true)}
			onTouchMove={e => moveDraggableObject(e, true)}
			
			{...rest}
		>
			{children}
		</div>
		</>
	);
};

export { DragObject };
