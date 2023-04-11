<script lang="ts">
	import Field from '../Field.svelte';
	import Button from '../Button.svelte';
    import Form from '../Form.svelte';
	import SelectCreate from '$components/SelectCreate.svelte';
	import { createClass, type ExtendedAPIResponse } from '$lib/api/api';

	export let onSubmit = async () => {};
	let error = '';

	const create = async () => {
		createClass(
			localStorage.getItem('token') || '',
			localStorage.getItem('id_token') || '',
			{
				name: 'test',
				students: [{
					email: 'example@gmail.com'
				}]
			}
		).then((res) => {
			let r = res as ExtendedAPIResponse;
			if (r.status === 201) {
				onSubmit();
			} else {
				error = r.message;
			}
		});
	};
</script>

<template>
	<h1 class="error">{error}</h1>
	<Form>
		<Field label="Name" type="text" placeholder="ex: Assignment 1 Peer Review" value={''} />
		<SelectCreate label='Students'/>
		<Button onClick={create} action="Create Class" animation={false} />
	</Form>
</template>

<style>
	.error {
		@apply text-red-500 mt-4;
	}
</style>