<script lang="ts">
	import ActionButton from '$components/ActionButton.svelte';
	import CreateClass from '$components/Modals/CreateClass.svelte';
	import Pagination from '$components/Pagination.svelte';
	import Table from '$components/Table.svelte';
    import Modal from '$components/Modal.svelte';
	let currentPage = 0;
	let totalPages = 0;
	let prevPage = () => {};
	let nextPage = () => {};

    let modals = [];

    const openModal = (data: any) => {
		modals = [...modals, data];
	};

	const closeModal = (modalId: any) => {
		modals = modals.filter((modal: any) => modal.id !== modalId);
	};
</script>

<div>
	<h1 class="page-heading">Questions</h1>
	<div class="md:ml-auto md:w-96">
		<ActionButton
			action="Add Question"
			onClick={async () =>
				openModal({
					id: 'addPeerReview',
					title: 'Add Question',
					content: CreateClass,
					onSubmit: async () => {
						closeModal('addPeerReview');
					},
					onClose: () => {
						closeModal('addPeerReview');
					}
				})}
			animation={false}
			classNames="md:ml-auto md:self-center md:pt-8"
		/>
	</div>
	<Pagination {currentPage} {totalPages} {nextPage} {prevPage} />
	<Table />
    <div>
		{#each modals as modal}
			<Modal title={modal.title} showModal={true} onSubmit={modal.onSubmit} onClose={modal.onClose}>
				{#if modal.content}
					<svelte:component
						this={modal.content}
						onSubmit={modal.onSubmit}
						onClose={modal.onClose}
					/>
				{/if}
			</Modal>
		{/each}
	</div>
</div>

<style>
	.page-heading {
		@apply font-bold text-3xl mt-20 mb-10;
	}
</style>
