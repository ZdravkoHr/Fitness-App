import { useState, useRef, useEffect } from 'react';

const DEBOUNCE_TIME = 500;

const DebounceInput = ({
	initialValue,
	onChangeCb,
	timerNotifier,
	...rest
}) => {
	const [inputValue, setInputValue] = useState(initialValue);
	const timerID = useRef(null);

	const clearTimer = () => {
		if (!timerID.current) return;
		clearTimeout(timerID.current);
		timerNotifier && timerNotifier(false, 1);
	};

	useEffect(() => {
		if (inputValue === initialValue) return;
		//	clearTimer();
		timerID.current = setTimeout(() => {
			onChangeCb(inputValue);
			timerNotifier && timerNotifier(false, 2);
		}, DEBOUNCE_TIME);

		timerNotifier && timerNotifier(true, 3);

		return () => {
			clearTimer();
		};
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
