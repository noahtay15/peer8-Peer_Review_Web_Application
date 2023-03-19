<script lang="ts">
	import Field from '$components/Field.svelte';
	import Form from '$components/Form.svelte';
	import Heading from '$components/Heading.svelte';
    import Button from '$components/Button.svelte';
	import Link from '$components/Link.svelte';

	const onC = () => {
		console.log('clicked');
	};
</script>

<div class="h-full">
	<Heading heading="Login" subheading="Enter your credentials below.">Form</Heading>
	<Form>
		<Field placeholder="ex: example@gmail.com" label="Email Address" type="text" />
		<Field placeholder="**********" label="Password" type="text" />
        <Link text="Forgot password?" href="/forgot">Forgot Password?</Link>
		<Button onClick={onC} action="Login"/>
	</Form>
	<Link hiddenText="Don't have an account?" text="Create an account." href="/signup"/>
</div>
