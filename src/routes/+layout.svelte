<script lang="ts">
	import { page, navigating } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { currentLevel } from '$lib/stores/navigation';
	import '../app.postcss';
	import PageTransition from '$lib/components/PageTransition.svelte';

	export let data;

	const goToRoot = () => {
		goto('/');
	};

	currentLevel.set(0);

	$: if ($navigating) {
		// console.log(currentLevel)
		currentLevel.set($page.route.id!.split('/').length - 1);

		if ($page.route.id === '/') {
			currentLevel.set(0);
		}
	}

	onMount(() => {
		currentLevel.set($page.route.id!.split('/').length - 1);

		if ($page.route.id === '/') {
			currentLevel.set(0);
		}
	});
</script>

<svelte:head>
	<title>Login</title>
	<meta name="description" content="Peer8" />
</svelte:head>

<div class="main-block">
    <p on:click={goToRoot} on:keyup={goToRoot} class="logomark">peer8</p>
    <PageTransition pathname={data.pathname}>
        <div class="main">
            <slot />
        </div>
    </PageTransition>
</div>

<style>
	.main-block {
		@apply flex flex-col h-full w-full;
		overflow-y: hidden;
	}

	.logomark {
		@apply text-4xl font-bold text-primary ml-8 mt-10 cursor-pointer;
	}

	.main {
		@apply h-full mt-20 mx-8 justify-center md:mx-32 lg:mx-72 md:pb-10 lg:pb-28;
	}
</style>
