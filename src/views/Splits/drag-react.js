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
		if (dragInfo.dragging === false) console.log(dragInfo);
		if (!dragInfo.current.dragging) return;

		const source = isTouchEvent ? e.touches[0] : e;
		const { height, width } = dragInfo.current.item.getBoundingClientRect();
		const xDiff = source.clientX - dragInfo.current.initCoords.x - width / 2;
		const yDiff = source.clientY - dragInfo.current.initCoords.y - height / 2;

		dragInfo.current.item.style.transform = `translate(${xDiff}px, ${yDiff}px)`;
	};

	const stopDrag = e => {
		console.log(dragData);

		endCb && endCb();
		e.target.classList.remove('current-drag');
		const {
			left: targetX,
			top: targetY,
			width: targetWidth,
			height: targetHeight,
		} = e.target.getBoundingClientRect();
		dragInfo.current.item.style.transform = `translate(0, 0)`;
		dragInfo.current.dragging = false;

		for (const dropBox of dropBoxes) {
			console.log(dropBox);
			const { left, top, width, height } =
				dropBox.current.getBoundingClientRect();

			if (
				targetX + targetWidth >= left &&
				targetX <= left + width &&
				targetY + targetHeight >= top &&
				targetY <= top + height
			) {
				dropCb && dropCb(e, dragInfo);
				break;
			}
		}

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
