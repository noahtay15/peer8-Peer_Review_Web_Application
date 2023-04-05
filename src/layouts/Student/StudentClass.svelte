<script lang="ts">
	import Table from '$components/Table.svelte';
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
