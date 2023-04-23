<script lang="ts">
	import Field from '../Field.svelte';
	import Button from '../Button.svelte';
	import Form from '../Form.svelte';
	import QuestionCreator from '$components/QuestionCreator.svelte';
	import { createTemplate, type ExtendedAPIResponse } from '$lib/api/api';

	let questions: { question: string; max_points: number | null }[] = [];
	let templateName = '';

	export let onSubmit = async () => {};
	let error = '';
	let name_error = '';
	let valid = false;

	let qValid = false;

	const questionsValid = (questions: { question: string; max_points: number | null }[]) => {
		let valid = true;

		if (questions.length === 0) {
			return false;
		}

		questions.forEach((q) => {
			if (q.question === '') {
				valid = false;
			}
		});
		return valid;
	};

	const create = async () => {
		if (!valid) {
			name_error = 'Please enter a name for the template.';
			return;
		}

		if (!questionsValid(questions)) {
			error = 'Please enter valid questions and maximum points.';
			return;
		}

		const data = {
			name: templateName,
			questions: questions
		};

		await createTemplate(data).then((res) => {
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
		<Field
			label="Name"
			type="text"
			placeholder="ex: Basic Rubric v1.0"
			bind:value={templateName}
			bind:valid
			err_message={name_error}
			validator={(v) => v !== ''}
		/>
		<QuestionCreator bind:questions />
		<Button onClick={create} action="Create Template" animation={false} />
	</Form>
</template>

<style>
	.error {
		@apply text-red-500 mt-4;
	}
</style>
