<script lang="ts">
	import Field from '$components/Field.svelte';
	import Form from '$components/Form.svelte';
	import Heading from '$components/Heading.svelte';
    import Button from '$components/Button.svelte';
    import Link from '$components/Link.svelte';
</script>

<div class="h-full">
	<Heading heading="Login" subheading="Enter your credentials below.">Form</Heading>
	<Form>
		<Field placeholder="ex: example@gmail.com" label="Email Address" type="text" />
		<Field placeholder="**********" label="Password" type="text" />
        <Link text="lol" href="/" />
        <Button action="Login"/>
	</Form>
</div>