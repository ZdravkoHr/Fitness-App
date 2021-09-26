import { useState, useRef, useEffect } from 'react';

const DEBOUNCE_TIME = 500;

const DebounceInput = ({ initialValue, onChangeCb, ...rest }) => {
	const [inputValue, setInputValue] = useState(initialValue);
	const timerID = useRef(null);

	const clearTimer = () => {
		timerID.current && clearTimeout(timerID.current);
	};

	useEffect(() => {
		clearTimer();
		timerID.current = setTimeout(() => {
			onChangeCb(inputValue);
		}, DEBOUNCE_TIME);

		// return () => {};
	}, [inputValue]);

	return (
		<input
			value={inputValue}
			{...rest}
			onChange={e => setInputValue(e.target.value)}
		/>
	);
};

export default DebounceInput;
