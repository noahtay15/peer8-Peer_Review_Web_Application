<script lang="ts">
	import { library } from '@fortawesome/fontawesome-svg-core';
	import { faGraduationCap, faFileAlt } from '@fortawesome/free-solid-svg-icons';
	// @ts-ignore
	import { FontAwesomeIcon } from 'fontawesome-svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	library.add(faGraduationCap);
	library.add(faFileAlt);

	export let active = false;
	export let href = '';
	export let className = '';
	export let icon = 'grad';

	let shortenedClassName = className.length > 20 ? className.substring(0, 20) + '...' : className;

	const navigate = () => {
		goto(href);
	};

	onMount(() => {
	});
</script>

<div class="comp">
	<div class="nav-item" class:nav-active={active} on:click={navigate} on:keyup={navigate}>
		<div class="text-secondary">
			{#if icon === 'grad'}
				<FontAwesomeIcon icon={faGraduationCap} size="lg" class="mr-3" />
			{:else}
				<FontAwesomeIcon icon={faFileAlt} size="lg" class="mr-3" />
			{/if}
		</div>

		<p>{shortenedClassName}</p>
	</div>
</div>

<style>
	.comp {
		@apply mt-3;
	}

	.nav-item {
		@apply flex flex-row font-normal rounded-md py-2 px-4 text-sm cursor-pointer;
	}

	.nav-active {
		@apply bg-primary text-white;
	}
</style>
