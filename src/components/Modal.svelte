<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';
	import Field from '$components/Field.svelte';
	import Button from '$components/Button.svelte';

	const dispatch = createEventDispatcher();

	export let showModal = false;
	export let title = '';

	export let onSubmit: () => void;
	export let onClose: () => void;

	function handleFormSubmit() {
		if (onSubmit) {
			onSubmit();
		}
	}

	function handleClose() {
		if (onClose) {
			onClose();
		} else {
			dispatch('close');
		}
	}
</script>

{#if showModal}
	<div class="modal-overlay" in:fade={{ duration: 300 }} out:fade={{ duration: 300 }}>
		<div class="modal">
			<div class="modal-header">
				<h1>{title}</h1>
				<!-- Close svg X-->
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6 ml-auto cursor-pointer self-center"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					on:click={handleClose}
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</div>
			<div class="modal-content" style="max-height: 50vh; overflow-y: auto;">
				<slot />
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.modal {
		background-color: #fff;
		padding: 2rem;
		border-radius: 5px;
	}

	.modal-content {
		@apply px-2;
		min-width: 350px;
	}

	.modal-header h1 {
		@apply text-2xl font-bold text-primary;
	}

	.modal-header {
		@apply flex flex-row;
	}

	.modal-content::-webkit-scrollbar {
		width: 5px;
	}

	.modal-content::-webkit-scrollbar-track {
		background: #f1f1f1;
	}

	.modal-content::-webkit-scrollbar-thumb {
		background: #888;
		border-radius: 5px;
	}

	.modal-content::-webkit-scrollbar-thumb:hover {
		background: #555;
	}
</style>
