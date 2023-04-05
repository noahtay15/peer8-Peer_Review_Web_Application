<script lang="ts">
	import Field from '../Field.svelte';
	import Button from '../Button.svelte';
    import Form from '../Form.svelte';

	export let onSubmit = async () => {};

	const getStudents = async (search: string) => {
		let options = ['hello', 'world', 'test', 'test2'];

		if (search === '') {
			return options;
		}

		return options.filter((option) => option.includes(search));
	};
</script>

<template>
	<Form>
		<Field label="Name" type="text" placeholder="ex: Assignment 1 Peer Review" value={''} />
		<Button onClick={onSubmit} action="Create Class" animation={false} />
	</Form>
</template>
