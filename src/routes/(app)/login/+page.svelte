<script lang="ts">
	import Field from '$components/Field.svelte';
	import Form from '$components/Form.svelte';
	import Heading from '$components/Heading.svelte';
    import Button from '$components/Button.svelte';
	import Link from '$components/Link.svelte';
	import { login } from '$lib/api/api';
	import { goto } from '$app/navigation';
	import type { AuthenticationResultType } from 'aws-sdk/clients/cognitoidentityserviceprovider';

	let error = "";

	let email = '';
	let password = '';

	let emailError = 'Please enter a valid email address.';
	let emailValid = true;

	const onC = async () => {
		await login(email, password).then((res) => {
			if (res.status === 200) {
				let d = res.data as AuthenticationResultType;
				localStorage.setItem('token', d.AccessToken || "");
				localStorage.setItem('refresh_token', d.RefreshToken || "");
				localStorage.setItem('id_token', d.IdToken || "");
				goto('/dashboard');
			} else {
				error = res.message;
			}
		});
	};
</script>

<div class="h-full">
	<Heading heading="Login" subheading="Enter your credentials below.">Form</Heading>
	<p class="res-error">{error}</p>
	<Form>
		<Field err_message={emailError} placeholder="ex: example@gmail.com" label="Email Address" type="text" bind:value={email} bind:valid={emailValid} />
		<Field placeholder="**********" label="Password" type="password" bind:value={password} />
        <Link text="Forgot password?" href="/forgot">Forgot Password?</Link>
		<Button onClick={onC} action="Login"/>
	</Form>
	<Link hiddenText="Don't have an account?" text="Create an account." href="/signup"/>
</div>

<style>
	.res-error {
		@apply text-red-500 mt-10;
	}
</style>
