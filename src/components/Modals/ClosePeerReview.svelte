<script lang="ts">
	import Button from '../Button.svelte';
	import Form from '../Form.svelte';
	import { closePeerReview } from '$lib/api/api';

	export let onSubmit = async () => {};
    export let review_id = -1;

	let error = 'Failed to end peer review.';

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
	<h1 class="text-red-500">{error}</h1>
	<Form>
		<p class="mt-5">Are you sure you want to end this peer review? No students will be able to complete any assigned reviews after the review has closed.</p>
		<Button onClick={close} action="Close" animation={false} deleteAction classNames="bg-red-500" />
	</Form>
</template>
