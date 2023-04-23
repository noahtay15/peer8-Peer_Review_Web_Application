<script lang="ts">
	import Button from '../Button.svelte';
	import Form from '../Form.svelte';
	import { addStudents, createClass, type ExtendedAPIResponse } from '$lib/api/api';
	import ActionButton from '$components/ActionButton.svelte';
	import * as XLSX from 'xlsx';
	import { page } from '$app/stores';

	export let onSubmit = async () => {};

	let error = '';
	let fileInputRef: HTMLInputElement;
	let students: any[] = [];

	const create = async () => {
		let errors_length = 0;

		if (fileInputRef.files?.length === 0 || fileName === '') {
			error = 'Please upload a spreadsheet.';
			errors_length++;
		}

		if (spread_error !== '') {
			error = spread_error;
			errors_length++;
		}

		if (errors_length > 0) {
			return;
		}

		addStudents(
			{
                class_id: parseInt($page.params.id),
                students: students.map((student) => {
                    return {
                        FirstName: student['First Name'],
                        LastName: student['Last Name'],
                        Email: student['Email']
                    }
                })
            }
		).then((res) => {
			let r = res as ExtendedAPIResponse;
			if (r.status === 200) {
				onSubmit();
			} else {
				error = r.message;
			}
		});
	};

	const validate = (rows) => {
		// Check if the columns match the format (First Name, Last Name, Email)
		if (rows.length > 0) {
			const requiredColumns = ['First Name', 'Last Name', 'Email'];
			const columns = Object.keys(rows[0]);

			if (!columns.every((col) => requiredColumns.includes(col))) {
				return 'The spreadsheet is not in the correct format. There should be columns for First Name, Last Name, and Email only.';
			}
		}

		// Check for duplicate emails
		const emailSet = new Set();
		for (const row of rows) {
			if (emailSet.has(row.Email)) {
				return 'There are duplicate emails';
			}
			emailSet.add(row.Email);
		}

		return '';
	};

	async function handleFileSelection(event: Event) {
		const file = (event?.target as HTMLInputElement).files[0];

		if (file) {
			const reader = new FileReader();

			reader.onload = async (e) => {
				const data = new Uint8Array(e.target.result as ArrayBuffer);
				const workbook = XLSX.read(data, { type: 'array' });
				const sheetName = workbook.SheetNames[0];
				const worksheet = workbook.Sheets[sheetName];

				// Parse the rows as objects
				const rows = XLSX.utils.sheet_to_json<{
					'First Name': string;
					'Last Name': string;
					Email: string;
				}>(worksheet, { raw: false });

				// Validate the data
				spread_error = validate(rows);
				if (spread_error) {
					console.log(spread_error);
				} else {
					imported = true;
					fileName = file.name;
					studentsCount = rows.length;
					students = rows;
					// Your custom processing logic here
				}
			};

			reader.readAsArrayBuffer(file);
		}
	}

	async function simulateFileInputClick() {
		fileInputRef.click();
	}

	let spread_error = '';
	let imported = false;
	let fileName = '';
	let studentsCount = 0;
</script>

<template>
	<h1 class="error">{error}</h1>
	<Form>
		<input
			type="file"
			id="fileInput"
			accept=".xlsx"
			on:change={handleFileSelection}
			class="hidden"
			bind:this={fileInputRef}
		/>

		{#if spread_error}
			<p class="text-red-500 mt-5">{spread_error}</p>
		{/if}
		{#if imported}
			<p class="text-primary mt-5">{`Imported: ${fileName}`}</p>
			<p class="text-primary mt-2">{`Number of Students: ${studentsCount}`}</p>
		{/if}
		<label for="fileInput">
			<ActionButton action="Import Students (.xlsx)" animation={false} onClick={simulateFileInputClick} />
		</label>
		<!-- <SelectCreate label='Students'/> -->
		<Button onClick={create} action="Import" animation={false} />
	</Form>
</template>

<style>
	.error {
		@apply text-red-500 mt-4;
	}
</style>
