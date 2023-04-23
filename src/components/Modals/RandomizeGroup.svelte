<script lang="ts">
	import Button from "$components/Button.svelte";
	import { randomizeGroups } from "$lib/api/api";
    export let onSubmit = async () => {};
    export let onClose = async () => {};

    export let review_id = -1;
    let error = '';

    const randomize = async () => {
        if (review_id === -1) {
            return;
        }

        await randomizeGroups({
            peer_review_id: review_id
        }).then((res) => {
            console.log(res);
            if (res.status === 200) {
                onSubmit();
            } else {
                error = res.message;
            }
        });
    };

</script>


<template>
    <h1 class="mt-4 text-red-500">{error}</h1>
	<p class="mt-5 text-xl">Confirm that you want to randomize groups.</p>
    <p class="mt-3 text-red-700">By randomizing groups, each student within this class will be assigned to a group. If there are any existing groups, they will be deleted.</p>
	<div class="flex flex-row justify-between">
        <Button
            classNames="mt-5"
            action="Cancel"
            animation={false}
            onClick={onClose}
        />
        <Button
            classNames="mt-5 ml-5 bg-red-500 hover:bg-red-700 rounded-md"
            action="Randomize"
            animation={false}
            deleteAction
            onClick={randomize}
        />
    </div>
</template>
