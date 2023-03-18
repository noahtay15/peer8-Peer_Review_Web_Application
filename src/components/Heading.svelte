<script lang="ts">
	import { ChevronLeftIcon } from 'svelte-feather-icons';
	import { currentLevel } from '$lib/stores/navigation';
	import { goto } from '$app/navigation';
	export let heading: string;
	export let subheading: string;
	export let classes: string = '';
	export let navigation: boolean = false;

	const goBack = () => {
		if ($currentLevel > 0) {
			goto('/')
		}
	};
</script>

<div class="comp">
	<div class="flex flex-row">
		{#if navigation}
			<div class="self-center mr-3 cursor-pointer" on:click={goBack} on:keyup={goBack}>
				<ChevronLeftIcon class="w-6 h-6" />
			</div>
		{/if}
		<h1 class="heading {classes}">{heading}</h1>
	</div>
	<div class="my-6" />
	<h2 class="subheading">{subheading}</h2>
</div>

<style>
	.comp {
		@apply mt-10;
	}
	.heading {
		@apply text-3xl font-medium text-primary;
	}
	.subheading {
		@apply text-xl font-normal;
	}
</style>
