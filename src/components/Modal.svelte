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
			</div>
			<div class="modal-content">
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
		width: 30rem;
	}

	.modal-header h1 {
		@apply text-2xl font-bold text-primary;
	}
</style>
