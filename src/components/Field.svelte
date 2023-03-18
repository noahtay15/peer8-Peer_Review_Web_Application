<script lang="ts">
	export let type: string;
	export let label: string;
	export let placeholder: string;
</script>

<div class="comp">
	<h1 class="label">{label}</h1>
    <div class="input-container">
        <input class="input" {type} {placeholder} />
        <div class="input-border"></div>
    </div>
</div>

<style lang="scss">
	.comp {
		@apply mt-10;
	}

	.input {
		@apply w-full h-10 px-4 py-2 border-2 border-[#D2D1D1] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#726998] focus:border-transparent;
	}

	.label {
		@apply text-base font-light mb-3;
	}
</style>
