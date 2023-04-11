<script lang="ts">
	import ActionButton from '$components/ActionButton.svelte';
	import Modal from '$components/Modal.svelte';
	import PeerReview from '$components/Modals/CreatePeerReview.svelte';
	import TabContent from '$components/TabContent.svelte';
	import Table from '$components/Table.svelte';
	import Tabs from '$components/Tabs.svelte';
	import { getPeerReviews, getStudents } from '$lib/api/api';
	import { onMount } from 'svelte';

	let tabs = [
		{
			name: 'Reviews',
			props: {
				data: [],
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
			props: {
				data: [],
				columns: [
					{
						name: 'Name',
						key: 'name',
						sortable: true,
						searchable: true
					},
					{
						name: 'Email',
						key: 'email',
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
		}
	];

	let modals: any = [];
	let currentTab = 0;
	let currentPage = 0;
	let totalPages = 0;

	const openModal = (data: any) => {
		modals = [...modals, data];

		console.log(modals);
	};

	const closeModal = (modalId: any) => {
		modals = modals.filter((modal: any) => modal.id !== modalId);
	};

	const fetchStudents = async (page: number) => {
		await getStudents(localStorage.getItem('token') || '', localStorage.getItem('id_token') || '', {
			page,
			classId: 1
		}).then((res) => {
			let r = res as any;
			if (r.status === 200) {
				tabs[1].props.data = r.data.students.map((student: any) => {
					return {
						name: student.name,
						email: student.email,
						actions: {
							delete: {
								label: 'Remove',
								onClick: (row: any) => {
									console.log(`Deleting ${row.name}`);
								}
							}
						}
					};
				});
				currentPage = page;
				totalPages = r.data.pages;
			} else {
				console.log(r.message);
			}
		});
	};

	const fetchPeerReviews = async () => {
		console.log("hi")
		await getPeerReviews(
			localStorage.getItem('token') || '',
			localStorage.getItem('id_token') || '',
			{
				classId: 1
			}
		).then((res) => {
			let r = res as any;
			if (r.status === 200) {
				tabs[0].props.data = r.data.peer_reviews.map((pr: any) => {
					return {
						name: pr.name,
						date: new Date(pr.due_date).toLocaleDateString(),
						status: pr.status,
						actions: {
							delete: {
								label: 'Remove',
								onClick: (row: any) => {
									console.log(`Deleting ${row.name}`);
								}
							}
						}
					};
				});
				
				console.log(r.data.peer_reviews);
			} else {
				console.log(r.message);
			}
		});
	};

	const nextPage = () => {
		if (currentPage < totalPages - 1) {
			fetchStudents(currentPage + 1);
		}
	};

	const prevPage = () => {
		if (currentPage > 0) {
			fetchStudents(currentPage - 1);
		}
	};

	onMount(async () => {
		await fetchStudents(currentPage);
		await fetchPeerReviews();
	});
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
	<Tabs bind:currentTab {tabs}>
		<TabContent index={0} current={currentTab}>
			<div class="flex flex-col">
				<div class="flex space-x-2 mt-10">
					<button
						class={`${
							currentPage === 0 ? 'bg-inactive' : 'bg-primary'
						} text-white font-light py-2 w-32 rounded`}
						on:click={prevPage}
						disabled={currentPage === 0}
					>
						Previous
					</button>
					<button
						class={`${
							currentPage === totalPages - 1 ? 'bg-inactive' : 'bg-primary'
						} text-white font-light py-2 w-32 rounded`}
						on:click={nextPage}
						disabled={currentPage === totalPages - 1}
					>
						Next
					</button>
				</div>
				<Table {...tabs[0].props} />
				<br />
			</div>
		</TabContent>
		<TabContent index={1} current={currentTab}>
			<div class="flex flex-col">
				<div class="flex space-x-2 mt-10">
					<button
						class={`${
							currentPage === 0 ? 'bg-inactive' : 'bg-primary'
						} text-white font-light py-2 w-32 rounded`}
						on:click={prevPage}
						disabled={currentPage === 0}
					>
						Previous
					</button>
					<button
						class={`${
							currentPage === totalPages - 1 ? 'bg-inactive' : 'bg-primary'
						} text-white font-light py-2 w-32 rounded`}
						on:click={nextPage}
						disabled={currentPage === totalPages - 1}
					>
						Next
					</button>
				</div>
				<Table {...tabs[1].props} />
				<br />
			</div>
		</TabContent>
	</Tabs>
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
	.table {
		@apply w-full rounded-lg overflow-hidden;
	}
	.table thead {
		@apply bg-gray-200 text-gray-700;
	}
	.table th {
		@apply font-bold text-left py-2 px-4;
	}
	.table td {
		@apply text-sm py-2 px-4 border-b border-gray-200;
	}
	.table tr:last-child td {
		@apply border-b-0;
	}
	.table tr:hover {
		@apply bg-gray-100;
	}
</style>
