<script lang="ts">
	import Table from '$components/Table.svelte';
    import InstructorClass from '$layouts/Instructor/InstructorClass.svelte';
    import StudentClass from '$layouts/Student/StudentClass.svelte';
    import { onMount } from 'svelte';
    import { user } from '$lib/stores/user';
	import { goto } from '$app/navigation';
	import InstructorReview from '$layouts/Instructor/InstructorReview.svelte';

    // TODO: Pull class data by id
    onMount(async () => {
        //goto('/class/1/review/1');
    });
</script>

{#if $user.type === "Student"}
    <StudentClass />
{:else if $user.type === "Instructor"}
    <InstructorReview />
{/if}