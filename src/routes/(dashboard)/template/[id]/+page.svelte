<script lang="ts">
    import InstructorClass from '$layouts/Instructor/InstructorClass.svelte';
    import StudentClass from '$layouts/Student/StudentClass.svelte';
    import { onMount } from 'svelte';
    import { user } from '$lib/stores/user';
	import InstructorTemplate from '$layouts/Instructor/InstructorTemplate.svelte';

    // TODO: Pull class data by id
    onMount(async () => {
    });
</script>

<InstructorTemplate />