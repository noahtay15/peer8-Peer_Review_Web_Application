<script lang="ts">
	import Table from '$components/Table.svelte';
    import InstructorClass from '$layouts/Instructor/InstructorClass.svelte';
    import StudentClass from '$layouts/Student/StudentClass.svelte';
    import { onMount } from 'svelte';
    import { user } from '$lib/stores/user';
	import { goto } from '$app/navigation';
	import { getClassInfo } from '$lib/api/api';
	import { page } from '$app/stores';
    import {className} from '$lib/stores/info';

    // TODO: Pull class data by id
    onMount(async () => {
        await getClassInfo(parseInt($page.params.id)).then((res) => {
            let r = res.data as any;
            if (r) {
                className.name = r.name;
            }
        });
    });
</script>

{#if $user.type === "Student"}
    <StudentClass />
{:else if $user.type === "Instructor"}
    <InstructorClass />
{/if}