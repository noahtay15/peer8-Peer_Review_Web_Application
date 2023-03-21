<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$components/Button.svelte';
	import FieldWithButton from '$components/FieldWithButton.svelte';
	import Heading from '$components/Heading.svelte';
	import { confirmEmail, resendConfirmationCode, type ExtendedAPIResponse } from '$lib/api/api';

	let verifyCode = '';
	$: name = '';
	$: email = '';

	$: pageTitle = `Verify your account, ${name}`;
	$: verified = verifyCode === '1234'; // replace with actual verification code

	const handleVerify = async () => {
        await confirmEmail(email, verifyCode).then((res: ExtendedAPIResponse) => {
			if (res.status === 200) {
				goto('/login');
			}
		});
    };

    const resend = async () => {
		await resendConfirmationCode(email);
    };

	$: {
		name = $page.url.searchParams.get('name') as string;
		email = $page.url.searchParams.get('email') as string;
	}
</script>

<div class="h-full">
	<Heading heading={pageTitle} subheading={`We sent a verification code to ${email}.`} />
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
