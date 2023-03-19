<script lang="ts">
	import { tweened } from 'svelte/motion';
	import { onMount } from 'svelte';

	export let options = ['Student', 'Instructor'];

	let currentIndex = 0;

	function linear(t: number): number {
		return t;
	}

	const activeOption = tweened(0, {
		duration: 50,
		easing: linear
	});

	function handleClick(index: number) {
		activeOption.set(index);
		currentIndex = index;
	}

	onMount(() => {
		activeOption.subscribe((value) => {
			// console.log(value);

			console.log(value * 144);
		});
	});
</script>

<div class="comp">
	<div class="rounded h-10 mt-4 flex p-1 relative items-center">
		{#each options as option, index}
			<div class="w-32 flex justify-center font-light">
				<button on:click={() => handleClick(index)}>{option}</button>
			</div>
		{/each}
		<span
			class="bg-primary text-white font-light flex items-center justify-center w-32 rounded h-8 transition-all top-[4px] absolute left-1 anim"
			style:--move="translateX({$activeOption * 144}px)"
		>
			{options[currentIndex]}
		</span>
	</div>
</div>

<style lang="scss">
	.comp {
		@apply mt-10;
	}

	.anim {
		transform: var(--move);
	}
</style>
