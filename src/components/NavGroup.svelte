<script lang="ts">
	import { SearchIcon, PlusIcon } from 'svelte-feather-icons';
	import IconButton from './IconButton.svelte';
	export let category = '';
	export let searchable = false;
	export let addable = true;
	export let onAdd = () => {};
</script>

<div class="comp">
	<div class="nav-group">
		<div class="nav-group-header">
			<div class="flex flex-row">
				<h1 class="nav-group-title">{category}</h1>
				{#if addable}
				<div class="ml-auto" on:click={onAdd} on:keyup={onAdd}>
					<IconButton icon={PlusIcon} classes="ml-[10rem]" />
				</div>
				{/if}
			</div>
			{#if searchable}
				<div class="nav-group-search">
					<SearchIcon class="absolute w-5 h-5 top-[.6rem] left-3" />
					<input class="nav-group-search-input" type="text" placeholder="Search" />
				</div>
			{/if}
		</div>
		<div class="nav-group-items">
			<slot />
		</div>
	</div>
</div>

<style>
	.comp {
		@apply mt-10;
	}

	.nav-group-title {
		@apply font-bold text-2xl mb-8;
	}

	.nav-group-search-input {
		@apply w-full h-10 px-4 py-2 border-none bg-transparent focus:ring-transparent;
	}

	.nav-group-search-input::placeholder {
		@apply text-textinactive;
	}

	.nav-group-search {
		@apply relative pl-8 bg-[#F0F0F0] rounded-md;
	}

	.nav-group-items {
		@apply mt-8;
	}
</style>
