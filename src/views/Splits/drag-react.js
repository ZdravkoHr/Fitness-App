import { useRef, useEffect } from 'react';

const DragObject = ({
	dropBoxes,
	startCb,
	endCb,
	dropCb,
	dragData,
	children,
}) => {
	const dragInfo = useRef({ item: null, initCoords: null, dragging: false });

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

	const startDragging = (e, data, isTouchEvent) => {
		e.preventDefault();
		startCb && startCb();
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
			dragging: true,
		};
	};

	const moveDraggableObject = (e, isTouchEvent) => {
		if (!dragInfo.current.dragging) return;

		const source = isTouchEvent ? e.touches[0] : e;
		const { height, width } = dragInfo.current.item.getBoundingClientRect();
		const xDiff = source.clientX - dragInfo.current.initCoords.x - width / 2;
		const yDiff = source.clientY - dragInfo.current.initCoords.y - height / 2;

		dragInfo.current.item.style.transform = `translate(${xDiff}px, ${yDiff}px)`;
	};

	const stopDrag = e => {
		const isDroppable = isColliding(e.target);

		for (const dropBox of dropBoxes) {
			if (!isDroppable(dropBox.current)) continue;

			dropCb && dropCb(e, dragInfo);
			break;
		}
		endCb && endCb();
		e.target.classList.remove('current-drag');
		dragInfo.current.item.style.transform = `translate(0, 0)`;
		dragInfo.current.dragging = false;
		document.removeEventListener('mousemove', moveDraggableObject);
	};

	useEffect(() => {
		document.addEventListener('mouseleave', stopDrag);
	}, []);

	return (
		<div
			onMouseDown={e => startDragging(e, dragData)}
			onMouseUp={stopDrag}
			onTouchStart={e => startDragging(e, dragData, true)}
			onTouchMove={e => moveDraggableObject(e, true)}
			onTouchEnd={e => stopDrag(e)}
		>
			{children}
		</div>
	);
};

export { DragObject };
