<script lang="ts">
	import { tweened } from 'svelte/motion';
	import { onMount } from 'svelte';

	export let options = ['Student', 'Instructor'];
	export let selectedOption = '';

	let currentIndex = 0;

	function linear(t: number): number {
		return t;
	}

	const activeOption = tweened(0, {
		duration: 50,
		easing: linear
	});

	function handleClick(e: any, index: number) {
		e.preventDefault();
		currentIndex = index;
		activeOption.set(index);
	}

	onMount(() => {
		activeOption.subscribe(() => {
			selectedOption = options[currentIndex];
		});
	});
</script>

<div class="comp">
	<div class="rounded h-10 mt-4 flex p-1 relative items-center">
		{#each options as option, index}
			<div class="w-32 flex justify-center font-light">
				<button on:click={(e) => handleClick(e, index)}>{option}</button>
			</div>
		{/each}
		<span
			class="bg-primary text-white font-light flex items-center justify-center w-32 rounded h-8 transition-all top-[4px] absolute left-1 anim"
			style:--move="translateX({$activeOption * 144}px)"
		>
			{options.at(currentIndex)}
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
