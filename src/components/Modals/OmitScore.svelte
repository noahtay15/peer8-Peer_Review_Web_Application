<script lang="ts">
	import Button from "$components/Button.svelte";
	import { omitSubmission } from "$lib/api/api";
    export let onSubmit = async () => {};
    export let onClose = async () => {};

    export let submission_id = -1;
    let error = ""

    const deleteS = async () => {

        if (submission_id === -1) {
            error = "Submission not found.";
            return;
        }

        const data = {
            submission_id: submission_id,
        }

        await omitSubmission(data).then((res) => {
            let r = res as any;
            if (r.status === 200) {
                onSubmit();
            } else {
                error = r.message;
            }
            console.log(res)
        });

        onSubmit();
    };
    
</script>
<template>
    <h1 class="mt-4 text-red-500">{error}</h1>
	<p class="mt-5 text-xl">Are you sure you want to omit this submission?</p>
    <p class="mt-3 text-red-700">Their submission will not count towards their group's score.</p>
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
