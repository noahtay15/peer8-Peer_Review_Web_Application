<script lang="ts">
	export let type: string = 'text';
	export let label: string;
	export let placeholder: string;
	export let value: string;
	export let validator: (value: string) => boolean = () => true;
	export let valid: boolean = true;
	export let err_message: string;
    // Make callback a promise by default
	export let callback: () => Promise<void> = () => Promise.resolve();

	const TIMEOUT = 30000; // 30 seconds
	let isButtonDisabled = false;
	let remainingTime = TIMEOUT / 1000;
	let timeoutId: number;

	function typeAction(node: HTMLInputElement) {
		node.type = type;
	}

	const validate = () => {
		valid = validator(value);
	}

	const handleClick = async () => {
		if (!isButtonDisabled) {
			isButtonDisabled = true;
			await callback();
			timeoutId = window.setInterval(() => {
				remainingTime--;
				if (remainingTime === 0) {
					window.clearInterval(timeoutId);
					isButtonDisabled = false;
					remainingTime = TIMEOUT / 1000;
				}
			}, 1000);
		}
	}
</script>

<div class="comp">
	<h1 class="label">{label}</h1>
	<div class="flex flex-row">
		<input
			class="input"
			use:typeAction
			{placeholder}
			bind:value
			on:change={validate}
			class:invalid={!valid}
			class:normal={valid}
		/>
		<button class="button" disabled={isButtonDisabled} on:click={handleClick} class:disabled={isButtonDisabled}>
			{isButtonDisabled ? `${remainingTime}` : 'Re-send'}
		</button>
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
		@apply w-full h-10 px-4 py-2 border-2 border-[#D2D1D1] rounded-md shadow-sm;
	}

	.button {
		@apply h-10 w-48 px-4 ml-2 border-2 border-[#D2D1D1] rounded-md shadow-sm bg-primary text-white font-light cursor-pointer;
	}

	.label {
		@apply text-base font-light mb-3;
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

    .disabled {
        @apply cursor-not-allowed text-inactive;
    }
</style>
