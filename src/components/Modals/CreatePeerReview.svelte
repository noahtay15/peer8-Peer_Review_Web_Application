<script lang="ts">
	import Field from '../Field.svelte';
	import Datepicker from '../Datepicker.svelte';
	import Button from '../Button.svelte';
	import Select from '../Select.svelte';
	import Form from '../Form.svelte';
	import { createPeerReview, getTemplates} from '$lib/api/api';
	import { page } from '$app/stores';

	export let onSubmit = async () => {};

	interface Template {
		created_at: string;
		creator_id: number;
		id: number;
		last_updated: string;
		max_points: number;
		name: string;
	}

	let templates: Template[] = [];

	const getT = async (search: string) => {
		let page = 0;
		let total_pages = 1;

		let options: string[] = [];

		while (page < total_pages) {
			await getTemplates(page).then((res) => {
				let r = res.data as any;
				if (r) {
					options = options.concat(r.map((template: any) => `${template.name}`));
					templates = r;
				}
				total_pages = r.pages;
			});
			page++;
		}

		if (search === '') {
			return options;
		}

		return options.filter((option) => option.includes(search));
	};

	let review_name = '';
	let template = '';
	let due_date = '';
	let error = '';

	// Errors
	let error_review_name = '';

	// Valid states
	let valid_review_name = false;
	let valid_template = true;
	let valid_due_date = true;

	const validate = () => {
		if (review_name === '') {
			error_review_name = 'Please enter a name for the peer review.';
		} else {
			error_review_name = '';
		}

		if (template === '') {
			valid_template = false;
		} else {
			valid_template = true;
		}

		if (due_date === '' || Date.parse(due_date) < Date.now()) {
			valid_due_date = false;
		} else {
			valid_due_date = true;
		}
	};

	const create = async () => {
		validate();

		// validate
		if (review_name === '' || template === '' || due_date === '') {
			return;
		}


		// get current template
		let current_template = templates.find((t) => t.name === template)?.id;

		if (!current_template || current_template === undefined) {
			return;
		}

		// due date
		if (Date.parse(due_date) < Date.now()) {
			return;
		}


		await createPeerReview({
			name: review_name,
			template_id: current_template as number,
			due_date: due_date,
			class_id: parseInt($page.params.id)
		}).then((res) => {
			if (res.status === 201) {
				onSubmit();
				error = '';
			} else {
				error = res.message;
			}
		});

		onSubmit();
	};
</script>

<template>
	<h1 class="text-red-500">{error}</h1>
	<Form>
		<Field
			label="Name"
			type="text"
			placeholder="ex: Assignment 1 Peer Review"
			bind:value={review_name}
			bind:valid={valid_review_name}
			validator={(v) => v !== ''}
			err_message={error_review_name}
		/>
		<Select
			label="Template"
			placeholder="Choose from a template"
			fetchOptions={getT}
			on:change={(e) => {
				template = e.detail;
			}}
			err_message="Invalid Template"
		/>
		{#if !valid_template}
			<p class="text-sm mt-4 text-red-500">Please select a template.</p>
		{/if}
		{#if templates.length === 0}
			<p class="text-sm my-6 text-gray-500">No templates found. Create a new template first.</p>
		{/if}
		<Datepicker label="Due Date" placeholder="" bind:value={due_date} />
		{#if !valid_due_date}
			<p class="text-sm mt-4 text-red-500">Please select a valid due date.</p>
		{/if}
		<Button onClick={create} action="Create Peer Review" animation={false} />
	</Form>
</template>
