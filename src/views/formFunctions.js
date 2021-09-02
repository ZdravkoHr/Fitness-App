const NOTIFICATION_CLOSE_TIME = 2000;

const showError = (error, setFail, setErrorTxt, setCloseTimer) => {
	setFail(true);
	setErrorTxt(error.message);
	const closeTimer = setTimeout(() => {
		setFail(false);
	}, NOTIFICATION_CLOSE_TIME);

	setCloseTimer(closeTimer);
};

export { showError };
