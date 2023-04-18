<script lang="ts">
	interface Tab {
		name: string;
		props: any;
	}

	export let tabs: Tab[] = [];
	export let currentTab = 0;
	export let actionButtons = []; // Change this line to accept an array of action buttons

	const switchTab = (index: number) => {
		currentTab = index;
	};
</script>

<div class="comp">
	<div class="flex flex-row">
		<div class="mr-auto flex flex-row">
			{#each tabs as tab, index}
				<h1
					class="tab"
					class:tab-active={currentTab === index}
					on:click={() => switchTab(index)}
					on:keyup={() => switchTab(index)}
				>
					{tab.name}
				</h1>
			{/each}
		</div>
		<!-- Update this block to render multiple action buttons in the same row as tabs -->
		{#each actionButtons as actionButton, i}
			{#if actionButton.tab === currentTab}
				<div class="mx-2">
					<svelte:component this={actionButton.component} {...actionButton.props} />
				</div>
			{/if}
		{/each}
	</div>
	<div class="tab-content">
		<slot />
	</div>
</div>

<style>
	.comp {
		@apply mt-10;
	}

	.tab-active {
		@apply font-semibold text-xl text-primary !important;
	}

	.tab {
		@apply font-semibold text-xl text-inactive cursor-pointer self-center mt-[2rem] mr-[2rem];
	}
</style>
