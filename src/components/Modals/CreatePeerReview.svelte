<script lang="ts">
	import Field from '../Field.svelte';
	import Datepicker from '../Datepicker.svelte';
	import Button from '../Button.svelte';
	import Select from '../Select.svelte';
	import Form from '../Form.svelte';
	import { createPeerReview, getTemplates } from '$lib/api/api';
	import { page } from '$app/stores';

	export let onSubmit = async () => {};

	const getStudents = async (search: string) => {
		let options = ['hello', 'world', 'test', 'test2'];

		if (search === '') {
			return options;
		}

		return options.filter((option) => option.includes(search));
	};

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

	const create = async () => {
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
		<Select
			label="Template"
			placeholder="Choose from a template"
			fetchOptions={getT}
			on:change={(e) => {
				template = e.detail;
			}}
			err_message="Invalid Template"
		/>
		<Datepicker label="Due Date" placeholder="" bind:value={due_date} />
		<Button onClick={create} action="Create Peer Review" animation={false} />
	</Form>
</template>
