<script lang="ts">
	export let type: string = 'text';
	export let label: string;
	export let placeholder: string;
	export let value: string;
	export let validator: (value: string) => boolean = () => true;
	export let valid: boolean = true;
	export let err_message: string = '';

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
		<input class="input" use:typeAction {placeholder} bind:value on:change={validate} class:invalid={!valid} class:normal={valid} />
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

	.normal {
		@apply border-[#D2D1D1] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent;
	}

	.invalid {
		@apply border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent;
	}
</style>
