<script lang="ts">
	import { onMount } from 'svelte';

	export let action: string;
	export let onClick: () => Promise<void> = () => Promise.resolve();

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

<div class="comp">
	<button class="btn animating h-12 outline-none" on:click={handleClick}>
		{#if isLoading}
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

<style>
	.comp {
		@apply mt-10;
	}

	.btn {
		@apply bg-primary text-white text-base font-normal py-3 px-4 rounded w-full relative overflow-hidden;
	}
</style>
