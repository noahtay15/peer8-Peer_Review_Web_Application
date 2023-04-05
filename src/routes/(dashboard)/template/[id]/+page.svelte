<script lang="ts">
    import InstructorClass from '$layouts/Instructor/InstructorClass.svelte';
    import StudentClass from '$layouts/Student/StudentClass.svelte';
    import { onMount } from 'svelte';
    import { user } from '$lib/stores/user';

    // TODO: Pull class data by id
    onMount(async () => {
    });
</script>

{#if $user.type === "Student"}
    <StudentClass />
{:else if $user.type === "Instructor"}
    <InstructorClass />
{/if}