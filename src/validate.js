const validateEmail = email => {
	if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email)) {
		throw new Error('Your email is invalid', {
			cause: 'email',
		});
	}
};

const validatePassword = pass => {
	if (pass.replace(/ /g).length <= 5) {
		throw new Error(
			'The password must be atleast 6 symbols long, excluding empty spaces',
			{
				cause: 'password',
			}
		);
	}
};

const validateUsername = name => {
	if (name.replace(/ /g).length <= 1) {
		throw new Error(
			'The username must be atleast 2 symbols long, excluding empty spaces',
			{
				cause: 'username',
			}
		);
	}
};

export { validateEmail, validatePassword, validateUsername };
