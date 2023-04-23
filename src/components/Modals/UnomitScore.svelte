<script lang="ts">
	import ActionButton from "$components/ActionButton.svelte";
	import Button from "$components/Button.svelte";
	import { unomitSubmission } from "$lib/api/api";
    export let onSubmit = async () => {};
    export let onClose = async () => {};

    export let submission_id = -1;
    let error = ""

    const unomit = async () => {

        if (submission_id === -1) {
            error = "Submission not found.";
            return;
        }

        const data = {
            submission_id: submission_id,
        }

        await unomitSubmission(data).then((res) => {
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
	<p class="mt-5 text-xl">Are you sure you want to un-omit this submission?</p>
    <p class="mt-3">Their submission will be counted towards their group's final score.</p>
	<div class="flex flex-row justify-between">
        <Button
            classNames="mt-5"
            action="Cancel"
            animation={false}
            onClick={onClose}
        />
        <ActionButton
            classNames="mt-5 ml-5 bg-red-500 hover:bg-red-700"
            action="Un-omit"
            animation={false}
            onClick={unomit}
        />
    </div>
</template>
