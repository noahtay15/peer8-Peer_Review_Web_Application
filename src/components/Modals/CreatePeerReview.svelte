<script lang="ts">
	import Field from '../Field.svelte';
    import Datepicker from '../Datepicker.svelte';
	import Button from '../Button.svelte';
	import Select from '../Select.svelte';
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
		<Select label="Template" placeholder="Choose from a template" fetchOptions={getStudents}/>
		<Datepicker label="Due Date" placeholder="" value={''} />
		<Select label="Students" placeholder="Search for a student" fetchOptions={getStudents}/>
		<Button onClick={onSubmit} action="Create Peer Review" animation={false} />
	</Form>
</template>
