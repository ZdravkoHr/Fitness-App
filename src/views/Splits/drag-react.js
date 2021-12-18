import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { dragSelector } from 'store';
import { update } from 'store/slices/drag';
import uuid from 'react-uuid';
import FakeItem from './FakeItem';

const DragObject = ({
	dropBoxes,
	id,
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
	const { dragging, initCoords, clientCoords, dragID, data } =
		useSelector(dragSelector);

	const dispatch = useDispatch();
	const dragObject = useRef();
	const [localDragging, setLocalDragging] = useState(false);

	const updateState = state => {
		dispatch(update(state));
	};

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

	const clearDragElement = () => {
		if (!localDragging) return;

		updateState({ dragging: false });
		setLocalDragging(false);
	};

	const startDragging = (e, data, isTouchEvent) => {
		e.preventDefault();

		updateState({ dragging: true, dragID: id, data: { ...dragData } });
		setLocalDragging(true);

		// if (!isTouchEvent) {
		// 	document.addEventListener('mousemove', moveDraggableObject);
		// }

		dragObject.current.classList.add('dragging');

		const newCoords = { x: e.clientX, y: e.clientY };

		updateState({ initCoords: newCoords });

		startCb && startCb();
	};

	useEffect(() => {
		if (localDragging) {
			document.body.addEventListener('mouseleave', clearDragElement);
			document.body.addEventListener('mouseup', stopDrag);
			document.addEventListener('mousemove', moveDraggableObject);
		}

		return () => {
			document.body.removeEventListener('mouseup', stopDrag);
			document.body.removeEventListener('mouseleave', clearDragElement);
			document.removeEventListener('mousemove', moveDraggableObject);
		};
	}, [localDragging]);

	const moveDraggableObject = (e, isTouchEvent) => {
		if (!localDragging) return;

		const source = isTouchEvent ? e.touches[0] : e;

		const newCoords = { x: source.clientX, y: source.clientY };

		updateState({ clientCoords: newCoords });

		moveCb && moveCb(e, { isColliding });
	};

	const stopDrag = () => {
		const fake = document.getElementById('fake-drag-item');
		if (!fake) return;
		const isDroppable = isColliding(fake);

		for (const dropBox of dropBoxes) {
			if (!isDroppable(dropBox.current)) continue;

			dropCb && dropCb();
			break;
		}

		updateState({ dragging: false });
		setLocalDragging(false);

		dragObject.current.classList.remove('dragging');
		endCb && endCb();
		clearDragElement();
	};

	return (
		<>
			<div
				className={className}
				ref={dragObject}
				onMouseDown={e => startDragging(e, dragData)}
				onTouchStart={e => startDragging(e, dragData, true)}
				onTouchMove={e => moveDraggableObject(e, true)}
				//	onMouseUp={stopDrag}
				onTouchEnd={stopDrag}
				id={id}
			>
				{children}
			</div>
		</>
	);
};

export { DragObject };
