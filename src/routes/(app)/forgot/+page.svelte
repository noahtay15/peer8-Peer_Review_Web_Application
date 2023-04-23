<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$components/Button.svelte';
	import Field from '$components/Field.svelte';
	import Heading from '$components/Heading.svelte';
	import { type ExtendedAPIResponse, forgotPassword } from '$lib/api/api';

	$: email = '';
	let error = '';
	$: pageTitle = `Change your password`;

    const resend = async () => {
		await forgotPassword(email).then((res: ExtendedAPIResponse) => {
			if (res.status === 200) {
				goto(`/forgot/verify?email=${email}`);
			} else {
				error = res.message;
			}
		});
    };
</script>

<div class="h-full">
	<Heading heading={pageTitle} subheading={`Enter your email below to request a password reset.`} />
	<h1 class="text-red-500 mt-4">{error}</h1>
	<Field
		err_message={''}
		placeholder="ex: example@gmail.com"
		label="Email Address"
		type="text"
		bind:value={email}
	/>
	<Button action="Send" onClick={resend} />
</div>

<style lang="scss">
	.heading {
		margin-top: 2rem;
	}
</style>
