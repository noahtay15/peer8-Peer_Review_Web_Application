<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import ActionButton from '$components/ActionButton.svelte';
	import Modal from '$components/Modal.svelte';
	import PeerReview from '$components/Modals/CreatePeerReview.svelte';
	import Pagination from '$components/Pagination.svelte';
	import TabContent from '$components/TabContent.svelte';
	import Table from '$components/Table.svelte';
	import Tabs from '$components/Tabs.svelte';
	import { getPeerReviews, getStudents } from '$lib/api/api';
	import { onMount } from 'svelte';
	import { className } from '$lib/stores/info';
	import DeleteStudent from '$components/Modals/DeleteStudent.svelte';
	import EditPeerReview from '$components/Modals/EditPeerReview.svelte';
	import ClosePeerReview from '$components/Modals/ClosePeerReview.svelte';
	import Button from '$components/Button.svelte';
	import AddStudent from '$components/Modals/AddStudent.svelte';

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

	// Pages
	let currentPageStudents = 0;
	let totalPagesStudents = 0;

	let currentPageReviews = 0;
	let totalPagesReviews = 0;

	const openModal = (data: any) => {
		modals = [...modals, data];
	};

	const closeModal = (modalId: any) => {
		modals = modals.filter((modal: any) => modal.id !== modalId);
	};

	const fetchStudents = async (page: number) => {
		await getStudents({
			class_id: $page.params.id,
			page
		}).then((res) => {
			let r = res as any;
			if (r.status === 200) {
				tabs[1].props.data = r.data.students.map((student: any) => {
					return {
						name: student.name,
						email: student.email,
						actions: {
							delete: {
								label: 'Delete',
								onClick: (row: any) => {
									openModal({
										id: 'deleteStudent',
										title: 'Delete Student',
										content: DeleteStudent,
										onSubmit: async () => {
											await fetchStudents(currentPageStudents);
											closeModal('deleteStudent');
										},
										onClose: () => {
											closeModal('deleteStudent');
										},
										props: {
											student_id: student.id,
										}
									});
								}
							}
						}
					};
				});
				currentPageStudents = page;
				totalPagesStudents = r.data.pages;
			} else {
			}
		});
	};

	const fetchPeerReviews = async (page: number) => {
		await getPeerReviews({
			class_id: $page.params.id,
			page
		}).then((res) => {
			let r = res as any;
			if (r.status === 200) {
				tabs[0].props.data = r.data.peer_reviews.map((pr: any) => {
					return {
						name: pr.name,
						date: new Date(pr.due_date).toLocaleDateString(),
						status: pr.status,
						actions: {
							View: {
								label: 'View',
								onClick: (row: any) => {
									goto(`/class/${$page.params.id}/review/${pr.id}`);
								}
							},
							Close: {
								label: 'Close',
								onClick: (row: any) => {
									openModal({
										id: 'editPeerReview',
										title: 'Close Peer Review',
										content: ClosePeerReview,
										onSubmit: async () => {
											await fetchPeerReviews(currentPageReviews);
											closeModal('editPeerReview');
										},
										onClose: () => {
											closeModal('editPeerReview');
										},
										props: {
											review_id: pr.id,
											review_name: pr.name,
											due_date: formatDate(new Date(pr.due_date).toLocaleDateString())
										}
									});
								}
							},
							Edit: {
								label: 'Edit',
								onClick: (row: any) => {
									openModal({
										id: 'editPeerReview',
										title: 'Edit Peer Review',
										content: EditPeerReview,
										onSubmit: async () => {
											closeModal('editPeerReview');
										},
										onClose: () => {
											closeModal('editPeerReview');
										},
										props: {
											review_id: pr.id,
											review_name: pr.name,
											due_date: formatDate(new Date(pr.due_date).toLocaleDateString())
										}
									});
								}
							}
						}
					};
				});
				currentPageReviews = page;
				totalPagesReviews = r.data.pages;
			} else {
			}
		});
	};

	const nextPage = () => {
		if (currentPageStudents < totalPagesStudents - 1) {
			fetchStudents(currentPageStudents + 1);
		}

		if (currentPageReviews < totalPagesReviews - 1) {
			fetchPeerReviews(currentPageReviews + 1);
		}
	};

	const prevPage = () => {
		if (currentPageStudents > 0) {
			fetchStudents(currentPageStudents - 1);
		}

		if (currentPageReviews > 0) {
			fetchPeerReviews(currentPageReviews - 1);
		}
	};

	function formatDate(dateString) {
		const date = new Date(dateString);
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

	onMount(async () => {
		await fetchStudents(currentPageStudents);
		await fetchPeerReviews(currentPageReviews);
	});
</script>

<!--

	<div class="md:ml-auto md:w-96">
				<ActionButton
					action="Add a Student"
					onClick={async () =>
						openModal({
							id: 'addPeerReview',
							title: 'Add a Student',
							content: PeerReview,
							onSubmit: async () => {
								await fetchPeerReviews(currentPageReviews);
								closeModal('addPeerReview');
							},
							onClose: () => {
								closeModal('addPeerReview');
							}
						})}
					animation={false}
					classNames="md:ml-auto md:self-center"
				/>
			</div>
-->

<div>
	<h1 class="page-heading">{className.name}</h1>
	<Tabs
		bind:currentTab
		{tabs}
		actionButtons={[
			{
				component: ActionButton,
				tab: 0,
				props: {
					action: 'Create a New Peer Review',
					onClick: () => {
						openModal({
							id: 'addPeerReview',
							title: 'Create a New Peer Review',
							content: PeerReview,
							onSubmit: async () => {
								await fetchPeerReviews(currentPageReviews);
								closeModal('addPeerReview');
							},
							onClose: () => {
								closeModal('addPeerReview');
							}
						});
					},
					animation: false,
					classNames: 'md:w-96'
				}
			},
			{
				component: ActionButton,
				tab: 1,
				props: {
					action: 'Add a Student',
					onClick: () => {
						openModal({
							id: 'addStudent',
							title: 'Add a Student',
							content: AddStudent,
							onSubmit: async () => {
								await fetchStudents(currentPageStudents);
								closeModal('addStudent');
							},
							onClose: () => {
								closeModal('addStudent');
							}
						});
					},
					animation: false,
					classNames: 'md:self-center'
				}
			}
		]}
	>
		<TabContent index={0} current={currentTab}>
			<Pagination
				currentPage={currentPageReviews}
				totalPages={totalPagesReviews}
				{nextPage}
				{prevPage}
			/>
			<Table {...tabs[0].props} />
		</TabContent>
		<TabContent index={1} current={currentTab}>
			<Pagination
				currentPage={currentPageStudents}
				totalPages={totalPagesStudents}
				{nextPage}
				{prevPage}
			/>
			<Table {...tabs[1].props} />
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
						{...modal.props}
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
