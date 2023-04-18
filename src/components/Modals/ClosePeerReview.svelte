<script lang="ts">
	import Field from '../Field.svelte';
	import Datepicker from '../Datepicker.svelte';
	import Button from '../Button.svelte';
	import Form from '../Form.svelte';
	import { closePeerReview, editPeerReview } from '$lib/api/api';
	import Heading from '$components/Heading.svelte';

	export let onSubmit = async () => {};
    export let review_id = -1;

	export let review_name = '';
	export let due_date = '';

	const close = async () => {
		await closePeerReview({
            review_id
		}).then((res) => {
			console.log(res);
		});

		onSubmit();
	};
</script>

<template>
	<Form>
		<p class="mt-5">Are you sure you want to end this peer review? No students will be able to complete any assigned reviews after the review has closed.</p>
		<Button onClick={close} action="Close" animation={false} deleteAction classNames="bg-red-500" />
	</Form>
</template>
