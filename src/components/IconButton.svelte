<script lang="ts">
	export let icon: any;
	export let onClick = () => {};
	export let classes = '';
	export let text = '';
</script>

<div class="flex flex-row" on:click={onClick} on:keyup={onClick}>
	<svelte:component this={icon} class="w-6 h-6 ml-auto mr-3 cursor-pointer outline-none" />
	<span class="self-center text-base text-primary cursor-pointer">{text}</span>
</div>
