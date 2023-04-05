<!-- TODO: Add a disabled state for the button -->

<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	export let action: string;
	export let onClick: () => Promise<void> = () => Promise.resolve();
	export let classNames: string = "";

	export let animation: boolean = true;
	export let transition: boolean = false;
	let isAnimating = false;
	let isLoading = false;

	async function handleClick() {
		onClick();
		if (!isAnimating) {
			isAnimating = true;
			isLoading = true;


			setTimeout(() => {
				isAnimating = false;
				isLoading = false;
			}, 2000);
		}
	}

	onMount(() => {
	});
</script>

{#if transition}
<div class={`comp ${classNames}`} out:fade={{ duration: 500 }} in:fade={{ duration: 500}}>
	<button class="btn animating h-10 outline-none" on:click={handleClick}>
		{#if isLoading && animation}
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6 animate-spin text-white absolute left-1/2 -ml-2.5 bottom-1/2 top-1/2 -mt-2.5"
			>
				<path
					d="M23 13C23 10.6266 22.3472 8.30655 21.1243 6.33316C19.9013 4.35977 18.163 2.8217 16.1293 1.91345C14.0956 1.0052 11.8577 0.76756 9.69871 1.23058C7.53972 1.6936 5.55655 2.83649 4 4.51472"
					stroke="white"
					stroke-linecap="round"
				/>
			</svg>
		{:else}
			{action}
		{/if}
	</button>
</div>
{:else}
<div class={`comp ${classNames}`}>
	<button class="btn animating h-10 outline-none" on:click={handleClick}>
		{#if isLoading && animation}
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6 animate-spin text-white absolute left-1/2 -ml-2.5 bottom-1/2 top-1/2 -mt-2.5"
			>
				<path
					d="M23 13C23 10.6266 22.3472 8.30655 21.1243 6.33316C19.9013 4.35977 18.163 2.8217 16.1293 1.91345C14.0956 1.0052 11.8577 0.76756 9.69871 1.23058C7.53972 1.6936 5.55655 2.83649 4 4.51472"
					stroke="white"
					stroke-linecap="round"
				/>
			</svg>
		{:else}
			{action}
		{/if}
	</button>
</div>
{/if}

<style>
	.comp {
		@apply mt-10;
	}

	.btn {
		@apply bg-secondary text-primary text-base font-normal px-12 rounded w-full relative overflow-hidden;
	}
</style>
