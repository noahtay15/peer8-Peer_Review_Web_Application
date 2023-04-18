<script lang="ts">
	import { page } from "$app/stores";
	import Button from "$components/Button.svelte";
	import { deleteStudent } from "$lib/api/api";
    export let onSubmit = async () => {};
    export let onClose = async () => {};

    export let student_id = -1;

    const deleteS = async () => {
        const data = {
            class_id: parseInt($page.params.id),
            students: [
                {
                    student_id: student_id
                }
            ]
        }

        await deleteStudent(data).then((res) => {
            let r = res as any;
            if (r.status === 200) {
                onSubmit();
            } else {
                console.log(r);
            }
            console.log(res)
        });

        onSubmit();
    };
    
</script>
<template>
	<p class="mt-5 text-xl">Are you sure you want to delete this student from this class?</p>
    <p class="mt-3 text-red-700">You will not be able to undo this action and all submissions from this student in this class will be erased!</p>
	<div class="flex flex-row justify-between">
        <Button
            classNames="mt-5"
            action="Cancel"
            animation={false}
            onClick={onClose}
        />
        <Button
            classNames="mt-5 ml-5 bg-red-500 hover:bg-red-700"
            action="Delete"
            animation={false}
            deleteAction
            onClick={deleteS}
        />
    </div>
</template>
