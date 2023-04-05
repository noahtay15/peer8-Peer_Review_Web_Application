<script lang="ts">
    interface Tab {
        name: string;
        component: any;
        props: any;
    }

	export let tabs: Tab[] = [];

	let currentTab = 0;

	const switchTab = (index: number) => {
		currentTab = index;
	};
</script>

<div class="comp">
    <div class="flex flex-row space-x-4">
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
    <svelte:component this={tabs[currentTab].component} {...tabs[currentTab].props}/>
</div>

<style>
	.comp {
		@apply mt-10;
	}

	.tab-active {
		@apply font-semibold text-xl text-primary !important;
	}

	.tab {
		@apply font-semibold text-xl text-inactive cursor-pointer;
	}
</style>
