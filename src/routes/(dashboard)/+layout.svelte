<!-- TODO: Fix highlighted state of mobile nav icon -->

<script lang="ts">
	import NavGroup from '$components/NavGroup.svelte';
	import NavItem from '$components/NavItem.svelte';
	import PageTransition from '$lib/components/PageTransition.svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import '../../app.postcss';
	// Import any necessary components, such as the navigation menu
	// layout
	export let data;

	let navIsOpen = false;

	onMount(() => {
		console.log(data.pathname);
	});

	function toggleNav() {
		navIsOpen = !navIsOpen;
		console.log(navIsOpen);
	}
</script>

<svelte:head>
	<title>Dashboard</title>
	<meta name="description" content="Peer8" />
</svelte:head>

<div class="main-block">
	<div class="main">
		<!-- Navigation column (for larger screens) -->
		<div class="hidden lg:block h-full w-[25rem] px-8">
			<p on:click={() => {}} on:keyup={() => {}} class="logomark">peer8</p>
			<NavGroup category="Classes" searchable>
				<NavItem href="/class" active={data.pathname === '/class'} className="Class 1"
					>Classes</NavItem
				>
				<NavItem href="/class/1" active={data.pathname === '/class/1'} className="Class 2"
					>New Class</NavItem
				>
			</NavGroup>
			<NavGroup category="Templates" searchable />
		</div>

		<!-- Navigation dropdown (for smaller screens) -->
		<div class="lg:hidden w-full">
			<div class="flex flex-row items-center justify-between px-8">
				<p on:click={toggleNav} class="logomark">peer8</p>
				<button
					on:click={toggleNav}
					aria-label="Toggle Navigation"
					class="text-gray-600 hover:text-primary focus:outline-none self-end pb-2"
				>
					<svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M3 6C3 5.44772 3.44772 5 4 5H20C20.5523 5 21 5.44772 21 6C21 6.55228 20.5523 7 20 7H4C3.44772 7 3 6.55228 3 6ZM3 12C3 11.4477 3.44772 11 4 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H4C3.44772 13 3 12.5523 3 12ZM4 17C3.44772 17 3 17.4477 3 18C3 18.5523 3.44772 19 4 19H16C16.5523 19 17 18.5523 17 18C17 17.4477 16.5523 17 16 17H4Z"
						/>
					</svg>
				</button>
			</div>
			{#if navIsOpen}
				<div
					class="flex flex-col items-center px-8"
					in:fade={{ duration: 500 }}
					out:fade={{ duration: 500 }}
				>
					<div class="w-full">
						<NavGroup category="Classes" searchable>
							<NavItem href="/class" active={data.pathname === '/class'} className="Class 1"
								>Classes</NavItem
							>
							<NavItem href="/class/1" active={data.pathname === '/class/1'} className="Class 2"
								>New Class</NavItem
							>
						</NavGroup>
					</div>
					<div class="w-full">
						<NavGroup category="Templates" searchable />
					</div>
				</div>
			{/if}
		</div>

		<!-- Main content column -->
		<div class="h-full w-full lg:w-3/4 p-8">
			<PageTransition pathname={data.pathname}>
				<slot />
			</PageTransition>
		</div>
	</div>
</div>

<style>
	.main-block {
		@apply flex flex-col h-full w-full;
	}

	.logomark {
		@apply text-4xl font-bold text-primary mt-10 lg:mb-20 cursor-pointer;
	}

	.main {
		@apply flex flex-col lg:flex-row h-screen;
	}

	@media (min-width: 1024px) {
		.main {
			@apply h-auto;
		}
	}
</style>
