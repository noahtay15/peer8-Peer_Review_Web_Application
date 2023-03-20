<script lang="ts">
	export let type: string = 'text';
	export let label: string;
	export let placeholder: string;
	export let value: string;
	export let validator: (value: string) => boolean = () => true;
	export let valid: boolean = true;
	export let inputFor: string;

	function typeAction(node: HTMLInputElement) {
		node.type = type;
	}

	function validate() {
		valid = validator(value);
	}
</script>

<div class="comp">
	<h1 class="label">{label}</h1>
	<div class="input-container">
		<input class="input" use:typeAction {placeholder} bind:value on:change={validate} />
		<div class="input-border" class:invalid={!valid} />
	</div>
	{#if !valid}
		<p class="error">Please enter a valid {inputFor}</p>
	{/if}
</div>

<style lang="scss">
	.comp {
		@apply mt-10 overflow-y-scroll;
	}

	.input {
		@apply w-full h-10 px-4 py-2 border-2 border-[#D2D1D1] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#726998] focus:border-transparent;
	}

	.label {
		@apply text-base font-light mb-3;
	}

	.error {
		@apply text-red-500 text-base font-light mt-3;
	}
</style>
