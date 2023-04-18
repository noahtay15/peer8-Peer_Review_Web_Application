<script lang="ts">
	import Field from '../Field.svelte';
	import Button from '../Button.svelte';
	import Select from '../Select.svelte';
	import Form from '../Form.svelte';
	import { createGroup, getStudents, type ExtendedAPIResponse } from '$lib/api/api';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	export let onSubmit = async () => {};
	export let class_id = -1;

	// get classid from url params
	const data = {
		class_id: class_id,
		page: 0
	};

    let students: any = [];

	const filterStudents = async (search: string) => {
		let options: string[] = [];

		let i = 0;
		let pages = 1;

		// Keep looping while there are more pages to request
		while (i < pages) {
			await getStudents(
				{ ...data, page: i } // Pass the current page number in the API request
			).then((res) => {
				let r = res.data as any;
				if (r.students) {
					options = options.concat(
						r.students.map((student: any) => `${student.name} (${student.email})`)
					);

                    students = r.students;
				}
				pages = r.pages; // Update the total number of pages
			});
			i++;
		}

		if (search === '') {
			return options;
		}

		return options.filter((option) => option.includes(search));
	};

    let err_message = "";
    let value: string[] = [];
    let name = "";

    const create = async () => {
        const data = {
            name: name,
            student_ids: [],
            peer_review_id: parseInt($page.params.id)
        }
        value.forEach((v) => {
            let student : any = students.find((s: any) => `${s.name} (${s.email})` === v);
            if (student) {
                data.student_ids.push(student.id);
            }
        })
        
        await createGroup(data).then((res) => {
            let r = res as ExtendedAPIResponse;
            
            if (r.message.includes("Success")) {
                onSubmit();
            } else {
                err_message = r.message;
            }
        })


        console.log(data)
    }

	onMount(()=>{
		console.log(class_id)
	})
</script>

<template>
    <h1 class="text-red-500 mt-5">{err_message}</h1>
	<Form>
		<Field label="Name" type="text" placeholder="ex: Group 1" bind:value={name} />
		<Select
			label="Students"
			placeholder="Select students"
			fetchOptions={filterStudents}
			multiSelect
            bind:value={value}
		/>
		<Button classNames="pt-20" onClick={create} action="Create Group" animation={false} />
	</Form>
</template>
