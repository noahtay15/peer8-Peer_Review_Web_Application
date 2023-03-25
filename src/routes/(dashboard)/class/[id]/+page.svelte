<script lang="ts">
	import Table from '$components/Table.svelte';
    import { onMount } from 'svelte';
    //import { goto } from '@roxi/routify';
    // import { user } from '$lib/stores';
    import { get } from 'svelte/store';

    //let classId = $params.id;
    //let userId = $user.id;
    let isStudent = false;

    // TODO: Pull class data by id

    onMount(async () => {
    });
</script>

<div>
    <h1 class="page-heading">Mock Class</h1>
    <h2 class="subheading">Peer Review Assignments</h2>
    <Table />
</div>

<style>
.page-heading {
    @apply font-bold text-3xl mt-2;
}

.subheading {
    @apply font-bold text-2xl mt-[5rem] text-primary;
}
</style>