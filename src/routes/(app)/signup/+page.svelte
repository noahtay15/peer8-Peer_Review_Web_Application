<!-- Parent component -->
<script lang="ts">
	import Field from '$components/Field.svelte';
	import Form from '$components/Form.svelte';
	import Heading from '$components/Heading.svelte';
	import Button from '$components/Button.svelte';
	import Switch from '$components/Switch.svelte';
	import { validateEmail, validatePassword } from '$lib/utils/validate';
	import type { APIResponse } from '$lib/types/Generic';
	import { goto } from '$app/navigation';
	import { signup, type ExtendedAPIResponse } from '$lib/api/api';

	// Main error
	let error = '';

	// TODO: Add validation for class code
	// We need to change this validator to check if the confirm password matches the password
	const validateConfirm = (value: string) => value.length > 0 && value === password;
	const validateName = (value: string) => value.length > 0;

	// Bind values
	let firstName = '';
	let lastName = '';
	let email = '';
	let password = '';
	let confirmPassword = '';
	let userType = 'Student';
	let classCode = '';

	// Validation states
	let validfName = true;
	let validlName = true;
	let validEmail = true;
	let validPassword = true;
	let validConfirmPassword = true;
	let validClassCode = true;

	// Error messages
	let firstNameError = 'Please enter a valid first name.';
	let lastNameError = 'Please enter a valid last name.';
	let emailError = 'Please enter a valid email address.';
	let passwordError =
		'Please enter a valid password that is at least 8 characters long, contains a number, a letter, and a special character.';
	let confirmPasswordError = 'Please ensure that the passwords match.';
	let classCodeError = 'Invalid class code.';

	// Re-validate in case someone tries to submit without changing anything
	const validateAllInputs = () => {
		validEmail = validateEmail(email);
		validPassword = validatePassword(password);
		validConfirmPassword = validateConfirm(confirmPassword) && password === confirmPassword;
		validfName = validateName(firstName);
		validlName = validateName(lastName);

		if (password !== confirmPassword) {
			confirmPasswordError = 'Passwords do not match.';
		}

		if (!validEmail) {
			emailError = 'Please enter a valid email address.';
		}

		if (!validPassword) {
			passwordError = 'Password must be at least 8 characters long.';
		}

		if (!validfName) {
			firstNameError = 'Please enter a valid first name.';
		}

		if (!validlName) {
			lastNameError = 'Please enter a valid last name.';
		}
	};

	const signupUser = async () => {
		validateAllInputs();
		await signup(email, password, `${firstName} ${lastName}`, userType, classCode).then(async (res: ExtendedAPIResponse) => {
			if (res.status === 200) {
				error = '';
				goto(`/verify?name=${firstName}&email=${email}`);
			} else {
				error = res.message;
			}
		});
	};
</script>

<div class="h-full">
	<slot name="heading">
		<Heading heading="Sign Up" subheading="Get started below." navigation>Form</Heading>
	</slot>
	<p class="res-error">{error}</p>
	<Form onSubmit={signupUser}>
		<Field
			err_message={firstNameError}
			placeholder="John"
			label="First Name"
			type="text"
			bind:value={firstName}
			bind:valid={validfName}
			validator={validateName}
		/>
		<Field
			err_message={lastNameError}
			placeholder="Doe"
			label="Last Name"
			type="text"
			bind:value={lastName}
			bind:valid={validlName}
			validator={validateName}
		/>
		<Field
			err_message={emailError}
			placeholder="example@gmail.com"
			label="Email Address"
			type="text"
			bind:value={email}
			bind:valid={validEmail}
			validator={validateEmail}
		/>
		<Field
			err_message={passwordError}
			placeholder="**********"
			label="Password"
			type="password"
			bind:value={password}
			bind:valid={validPassword}
			validator={validatePassword}
		/>
		<Field
			err_message={confirmPasswordError}
			placeholder="**********"
			label="Confirm Password"
			type="password"
			bind:value={confirmPassword}
			bind:valid={validConfirmPassword}
			validator={validateConfirm}
		/>
		<Switch options={['Student', 'Instructor']} bind:selectedOption={userType} />
		<!-- <Field
			err_message={classCodeError}
			placeholder="ex: A52E1AE"
			label="Class Code (optional)"
			type="text"
			bind:value={classCode}
		/> -->
		<Button action="Sign Up" />
	</Form>
</div>

<style>
	.res-error {
		@apply text-red-500 mt-10;
	}
</style>
