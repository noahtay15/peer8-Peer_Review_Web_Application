<script lang="ts">
	import ActionButton from '$components/ActionButton.svelte';
	import Button from '$components/Button.svelte';
	import Modal from '$components/Modal.svelte';
	import PeerReview from '$components/Modals/CreatePeerReview.svelte';
	import Table from '$components/Table.svelte';
	import Tabs from '$components/Tabs.svelte';
	import { onMount } from 'svelte';

	let tabs = [
		{
			name: 'Reviews',
			component: Table,
			props: {
				data: [
                    {
                        name: 'Assignment 1',
                        date: '2021-10-10',
                    }
                ],
				columns: [
					{
						name: 'Name',
						key: 'name',
						sortable: true,
						searchable: true
					},
                    {
                        name: 'Due Date',
                        key: 'date',
                        sortable: true,
                        searchable: true
                    },
                    {
                        name: 'Status',
                        key: 'status',
                        sortable: true,
                        searchable: true
                    },
                    {
                        name: '',
                        key: 'actions',
                        sortable: false,
                        searchable: false
                    }
				]
			}
		},
		{
			name: 'Students',
			component: Button,
			props: {
				action: 'Mock Button',
				onClick: () => console.log('Mock Button Clicked')
			}
		}
	];

	let modals: any = [];

	const openModal = (data: any) => {
		modals = [...modals, data];

		console.log(modals);
	};
	const closeModal = (modalId: any) => {
		modals = modals.filter((modal: any) => modal.id !== modalId);
	};

	onMount(async () => {});
</script>

<div>
	<h1 class="page-heading">Mock Class</h1>
	<div class="flex flex-col md:flex-row">
		<h2 class="subheading">Peer Reviews</h2>
		<ActionButton
			action="Create a New Peer Review"
			onClick={async () =>
				openModal({
					id: 'addPeerReview',
					title: 'Create a New Peer Review',
					content: PeerReview,
					onSubmit: () => {
						console.log('Form submitted!');
						closeModal('addPeerReview');
					},
					onClose: () => {
						console.log('Modal closed!');
						closeModal('addPeerReview');
					}
				})}
			animation={false}
			classNames="md:ml-auto md:self-center md:pt-8"
		/>
	</div>
	<Tabs {tabs} />
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
		@apply font-bold text-3xl mt-2;
	}

	.subheading {
		@apply font-bold text-2xl mt-[5rem] text-primary;
	}
</style>
