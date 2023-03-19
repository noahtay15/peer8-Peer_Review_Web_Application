<script lang="ts">
	import Field from '$components/Field.svelte';
	import Form from '$components/Form.svelte';
	import Heading from '$components/Heading.svelte';
    import Button from '$components/Button.svelte';
	import Switch from '$components/Switch.svelte';

	const signupUser = async () => {
		const res = await fetch('/api/signup', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: "",
				password: "",
			})
		});

		console.log(res);
	}
</script>

<div class="h-full">
	<slot name="heading">
		<Heading heading="Sign Up" subheading="Get started below." navigation>Form</Heading>
	</slot>
	<Form onSubmit={signupUser}>
		<Field placeholder="ex: example@gmail.com" label="Email Address" type="text" />
		<Field placeholder="**********" label="Password" type="text" />
		<Field placeholder="**********" label="Confirm Password" type="text" />
		<Switch options={['Student', 'Instructor']} />
		<Field placeholder="ex: A52E1AE" label="Class Code (optional)" type="text" />
        <Button action="Sign Up" onClick={signupUser} />
	</Form>
</div>