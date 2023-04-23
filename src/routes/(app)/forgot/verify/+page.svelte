<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$components/Button.svelte';
	import Field from '$components/Field.svelte';
	import FieldWithButton from '$components/FieldWithButton.svelte';
	import Heading from '$components/Heading.svelte';
	import { type ExtendedAPIResponse, forgotPassword, resetPassword } from '$lib/api/api';

	let verifyCode = '';
	$: name = '';
	$: email = '';

	let password = '';
	let cpassword = '';
	let error = '';

	$: pageTitle = `Change your password`;
	$: verified = verifyCode === '1234'; // replace with actual verification code

	const handleVerify = async () => {
		if (password !== cpassword) {
			error = 'Passwords do not match';
			return;
		}

        await resetPassword({
			email,
			password,
			code: verifyCode
		}
		).then((res: ExtendedAPIResponse) => {
			if (res.status === 200) {
				goto(`/login`);
			} else {
				error = res.message;
			}
		});
    };

    const resend = async () => {
		await forgotPassword(email);
    };

	$: {
		name = $page.url.searchParams.get('name') as string;
		email = $page.url.searchParams.get('email') as string;
	}
</script>

<div class="h-full">
	<Heading heading={pageTitle} subheading={`We sent a verification code to ${email}.`} />
	<h1 class="mt-4 text-red-500">{error}</h1>
	<Field
		err_message={''}
		placeholder="Enter your new password here"
		label="New Password"
		type="password"
		bind:value={password}
	/>
	<Field
		err_message={''}
		placeholder="Confirm your new password"
		label="Confirm New Password"
		type="password"
		bind:value={cpassword}
	/>
	<FieldWithButton
		err_message={''}
		placeholder="Enter the verification code here"
		label="Verification Code"
		type="text"
		bind:value={verifyCode}
        callback={resend}
	/>
	<Button action="Verify" onClick={handleVerify} />
</div>

<style lang="scss">
	.heading {
		margin-top: 2rem;
	}
</style>
