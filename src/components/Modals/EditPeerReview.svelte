<script lang="ts">
	import Field from '../Field.svelte';
	import Datepicker from '../Datepicker.svelte';
	import Button from '../Button.svelte';
	import Form from '../Form.svelte';
	import { editPeerReview } from '$lib/api/api';

	export let onSubmit = async () => {};
    export let review_id = -1;

	export let review_name = '';
	export let due_date = '';

	const create = async () => {
        console.log(due_date)

		// validate
		if (review_name === '' || due_date === '') {
			return;
		}

		// due date
		if (Date.parse(due_date) < Date.now()) {
			return;
		}

        if (review_id === -1) {
            return;
        }


		await editPeerReview({
			name: review_name,
			due_date: due_date,
            review_id
		}).then((res) => {
			console.log(res);
		});

		onSubmit();
	};
</script>

<template>
	<Form>
		<Field
			label="Name"
			type="text"
			placeholder="ex: Assignment 1 Peer Review"
			bind:value={review_name}
			validator={(v) => v !== ''}
			err_message="Invalid Name"
		/>
		<Datepicker label="Due Date" placeholder="" bind:value={due_date} />
		<Button onClick={create} action="Update" animation={false} />
	</Form>
</template>
