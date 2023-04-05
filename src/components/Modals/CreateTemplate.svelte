<script lang="ts">
	import Field from '../Field.svelte';
	import Button from '../Button.svelte';
	import Form from '../Form.svelte';
	import QuestionCreator from '$components/QuestionCreator.svelte';
	import { createTemplate, type ExtendedAPIResponse } from '$lib/api/api';

	let questions: { question: string; max_points: number | null }[] = [];
	let templateName = '';

	export let onSubmit = async () => {};

	const create = async () => {

        const data = {
            "name": templateName,
            "questions": questions
        }

		await createTemplate(
			localStorage.getItem('token') || '',
			localStorage.getItem('id_token') || '',
			data
		).then((res) => {
            let r = res as ExtendedAPIResponse;
            if (r.status === 201) {
                onSubmit();
            }
        });
	};
</script>

<template>
	<Form>
		<Field label="Name" type="text" placeholder="ex: Basic Rubric v1.0" bind:value={templateName} />
		<QuestionCreator bind:questions />
		<Button onClick={create} action="Create Template" animation={false} />
	</Form>
</template>
