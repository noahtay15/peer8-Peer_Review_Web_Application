<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { onMount, afterUpdate } from 'svelte';
	import { TrashIcon, CheckIcon } from 'svelte-feather-icons';

	export let label: string;
	export let placeholder: string;
	export let options: any[] = [];
	export let searchEnabled: boolean = false;
	export let multiSelect: boolean = false;
	export let value: any[] = [];
	export let fetchOptions: (search: string) => Promise<any[]>;
	export let validator: (value: any[]) => boolean = () => true;
	export let valid: boolean = true;
	export let err_message: string = '';

	const dispatch = createEventDispatcher();

	let dropdownOptions: any = [];
	let searchText = '';
	let isDropdownOpen = false;
	let states = {};
	let svalue = '';

	async function getOptions(search: any) {
		if (!fetchOptions) {
			dropdownOptions = options;
			return;
		}

		if (search === '') {
			dropdownOptions = await fetchOptions('');
			return;
		}

		dropdownOptions = await fetchOptions(search);
	}

	function toggleDropdown() {
		isDropdownOpen = !isDropdownOpen;
	}

	function closeDropdown() {
		isDropdownOpen = false;
	}

	function selectOption(option: any) {
		if (multiSelect) {
			value = [...value, option];
			states = { ...states, [option]: true };
			dispatch('change', value);
		} else {
			svalue = option;
			dispatch('change', option);
			closeDropdown();
		}
	}

	function removeOption(option: any) {
		states = { ...states, [option]: false };
		value = value.filter((selectedOption) => selectedOption !== option);
		dispatch('change', value);
	}

	function validate() {
		valid = validator(value);
	}

	onMount(async () => {
		await getOptions(searchText);
		if (multiSelect) {
			states = dropdownOptions.reduce((acc, option) => {
				acc[option] = value.includes(option);
				return acc;
			}, {});
		} else {
			svalue = '';
		}

		document.addEventListener('click', (event) => {
			const input = document.querySelector(`#${label}-input`);
			const dropContainer = document.querySelector(`#${label}-dropdown-container`);
			if (!event.target) return;
			const target = event.target as HTMLElement;
			if (!target.closest('.comp') && input && dropContainer) {
				closeDropdown();
			}
		});
	});

	afterUpdate(() => {
		validate();
	});

	$: {
		getOptions(searchText);
	}
</script>

<div class="comp">
	<h1 class="label">{label}</h1>
	<div
		class="input-container relative rounded-sm"
		class:ring-2={isDropdownOpen}
		class:ring-primary={isDropdownOpen}
	>
		<input
			type="text"
			class="input"
			id={`${label}-input`}
			placeholder={svalue !== '' ? `Selected: ${svalue}` : placeholder}
			on:input={(event) => (searchText = event.target?.value)}
			on:click={toggleDropdown}
		/>
		{#if isDropdownOpen && options}
			<div class="dropdown-options-container" id={`${label}-dropdown-container`}>
				{#each dropdownOptions as option}
					<label
						class="dropdown-option"
						class:single-select={!multiSelect}
						class:single-select-selected={svalue === option}
						on:click={() => {
							if (!multiSelect) {
								selectOption(option);
							}
						}}
					>
						{#if multiSelect}
							<button
								class="rounded-sm w-5 h-5 bg-gray-200"
								on:click={() => {
									if (states[option]) {
										removeOption(option);
									} else {
										selectOption(option);
									}
								}}
								class:selected-dropdown-option={states[option] && multiSelect}
								class:non-selected-dropdown-option={!states[option] && multiSelect}
							>
								<!-- Checkmark -->
								<CheckIcon size="24" class="w-5 h-5 text-gray-200" />
							</button>
						{/if}
						<span class="dropdown-option-text">{option.label || option}</span>
					</label>
				{/each}
			</div>
		{/if}

		<!-- <div class="selected-options-container">
			{#each value as option}
				<div class="selected-option">
					<span class="selected-option-text">{option.label || option}</span>
					<button class="remove-selected-option" on:click={() => removeOption(option)}>
						<TrashIcon />
					</button>
				</div>
			{/each}
		</div> -->
	</div>
	{#if !valid}
		<p class="error">{err_message}</p>
	{/if}
</div>

<style lang="scss">
	.comp {
		@apply mt-10;
	}

	.input {
		@apply w-full h-10 px-4 py-2 border-none bg-[#F0F0F0] focus:ring-transparent rounded-md;
	}

	.label {
		@apply text-base font-medium mb-3 text-primary;
	}

	.error {
		@apply text-red-500 text-base font-light mt-3;
	}

	.dropdown-options-container {
		@apply mt-2 absolute top-10 left-0 right-0 bg-white border border-gray-300 rounded-md z-10 max-h-64 overflow-y-auto shadow-md;
	}

	.dropdown-option {
		@apply py-2 px-4 flex space-x-4 items-center cursor-pointer;
	}

	.dropdown-option.selected {
		@apply bg-primary text-white;
	}

	.selected-options-container {
		@apply w-full;
	}

	.selected-option {
		@apply my-3 py-1 rounded-full flex flex-row justify-between items-center;
	}

	.selected-option-text {
		@apply text-base font-medium;
	}

	.remove-selected-option {
		@apply cursor-pointer w-5 h-5 mr-2;
	}

	.search-input {
		@apply w-full py-2 px-4 border border-gray-300 mb-2 rounded-md;
	}

	.selected-dropdown-option {
		@apply bg-primary;
	}

	.non-selected-dropdown-option {
		@apply bg-gray-200;
	}

	.single-select {
		@apply hover:bg-primary hover:text-white;
	}

	.single-select-selected {
		@apply bg-primary text-white;
	}
</style>
