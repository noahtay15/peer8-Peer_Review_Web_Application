<script lang="ts">
	export let icon: any;
	export let onClick = () => {};
	export let classes = '';
</script>

<svelte:component this={icon} class="w-6 h-6 ml-auto mt-1 cursor-pointer" on:click={onClick} />
