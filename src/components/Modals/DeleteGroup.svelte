<script lang="ts">
	import { page } from "$app/stores";
	import Button from "$components/Button.svelte";
	import { deleteGroup } from "$lib/api/api";
    export let onSubmit = async () => {};
    export let onClose = async () => {};

    export let group_id = -1;
    let error = ""

    const deleteG = async () => {

        if (group_id === -1) {
            error = "Group ID not found";
            return;
        }

        const data = {
            group_id: group_id,
        }

        await deleteGroup(data).then((res) => {
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
	<p class="mt-5 text-xl">Are you sure you want to delete this group?</p>
    <p class="mt-3 text-red-700">You will not be able to undo this action and all students will be removed from the group.</p>
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
            onClick={deleteG}
        />
    </div>
</template>
