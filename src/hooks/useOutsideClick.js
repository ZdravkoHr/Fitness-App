import { useEffect, useState } from 'react';

export default function useOutsideClick(ref) {
	const [isClicked, setIsClicked] = useState([]);
	useEffect(() => {
		console.log('in custom hook');
		function handleClickOutside(event) {
			if (ref.current && !ref.current.contains(event.target)) {
				setIsClicked([true]);
			} else {
				setIsClicked([false]);
			}
		}

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [ref]);
	return isClicked;
}
