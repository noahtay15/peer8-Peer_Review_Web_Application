<script lang="ts">
	import Field from '../Field.svelte';
	import Button from '../Button.svelte';
    import Form from '../Form.svelte';
	import { addStudents } from '$lib/api/api';
	import { page } from '$app/stores';

	export let onSubmit = async () => {};

    let fname = '';
    let lname = '';
    let email = '';

	const addStudent = async () => {
        const data = {
            class_id: parseInt($page.params.id),
            students: [
                {
                    FirstName: fname,
                    LastName: lname,
                    Email: email
                }
            ]
        }


        await addStudents(data).then((res) => {
            let r = res.data as any;
            if (r) {
                console.log(r);
                onSubmit();
            }
            console.log(res)
        });

        onSubmit();
    };
</script>

<template>
	<Form>
		<Field label="First Name" type="text" placeholder="ex: John" bind:value={fname} />
		<Field label="Last Name" type="text" placeholder="ex: Doe" bind:value={lname} />
		<Field label="Email" type="text" placeholder="ex: example@gmail.com" bind:value={email} />
		<Button onClick={addStudent} action="Add Student" animation={false} />
	</Form>
</template>
