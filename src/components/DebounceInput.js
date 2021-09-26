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
		timerNotifier && timerNotifier(false);
	};

	useEffect(() => {
		// clearTimer();
		timerID.current = setTimeout(() => {
			onChangeCb(inputValue);
			timerNotifier && timerNotifier(false);
		}, DEBOUNCE_TIME);

		console.log('timer notifier is: ', timerNotifier);
		console.log('onChangeCb is: ', onChangeCb);
		timerNotifier && timerNotifier(true);

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
