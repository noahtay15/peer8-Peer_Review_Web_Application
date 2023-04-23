// validate an email
export const validateEmail = (email) => {
	const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(?:edu)$/;
	return re.test(email);
};

// verify a password has at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character
export const validatePassword = (password) => {
	const re = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
	return re.test(password);
};
