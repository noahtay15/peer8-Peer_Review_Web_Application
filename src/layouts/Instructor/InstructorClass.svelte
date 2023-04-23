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
	import { getClassInfo, getPeerReviews, getStudents } from '$lib/api/api';
	import { onMount } from 'svelte';
	import { className } from '$lib/stores/info';
	import DeleteStudent from '$components/Modals/DeleteStudent.svelte';
	import EditPeerReview from '$components/Modals/EditPeerReview.svelte';
	import ClosePeerReview from '$components/Modals/ClosePeerReview.svelte';
	import AddStudent from '$components/Modals/AddStudent.svelte';
	import Searchbar from '$components/Searchbar.svelte';
	import Button from '$components/Button.svelte';
	import AddStudents from '$components/Modals/AddStudents.svelte';

	let tabs = [
		{
			name: 'Reviews',
			props: {
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

	// Actual table data
	let students: any = [];
	let reviews: any = [];

	// Filtered table data
	$: filteredStudents = students
	$: filteredReviews = reviews

	// Class name
	$: shortenedClassName = className.name?.length > 20 ? className.name?.substring(0, 20) + '...' : className.name;

	const openModal = (data: any) => {
		modals = [...modals, data];
	};

	const closeModal = (modalId: any) => {
		modals = modals.filter((modal: any) => modal.id !== modalId);
	};

	const fetchStudents = async (page: number) => {
		let result = await getStudents({
			class_id: $page.params.id,
			page
		});

		if (result.status === 200) {
			students = result.data.students.map((student: any) => {
				return {
					name: student.name,
					email: student.email,
					actions: {
						delete: {
							label: 'Delete',
							icon: 'delete',
							actionColor: 'text-red-500',
							onClick: (row: any) => {
								openModal({
									id: 'deleteStudent',
									title: 'Delete Student',
									content: DeleteStudent,
									onSubmit: async () => {
										students = [];
										await fetchStudents(currentPageStudents);
										closeModal('deleteStudent');
									},
									onClose: () => {
										closeModal('deleteStudent');
									},
									props: {
										student_id: student.id
									}
								});
							}
						}
					}
				};
			});
			currentPageStudents = page;
			totalPagesStudents = result.data.pages;
		}
	};

	const fetchPeerReviews = async (page: number) => {
		let result = await getPeerReviews({
			class_id: $page.params.id,
			page
		});

		if (result.status === 200) {
			reviews = result.data.peer_reviews.map((pr: any) => {
				return {
					name: pr.name,
					date: new Date(pr.due_date).toLocaleDateString(),
					status: pr.status,
					actions: {
						View: {
							label: 'View',
							icon: 'eye',
							onClick: (row: any) => {
								goto(`/class/${$page.params.id}/review/${pr.id}`);
							}
						},
						Edit: {
							label: 'Edit',
							icon: 'edit',
							onClick: (row: any) => {
								openModal({
									id: 'editPeerReview',
									title: 'Edit Peer Review',
									content: EditPeerReview,
									onSubmit: async () => {
										reviews = [];
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
						Close: {
							label: 'Close',
							icon: 'close',
							actionColor: 'text-red-500',
							onClick: async (row: any) => {
								openModal({
									id: 'editPeerReview',
									title: 'Close Peer Review',
									content: ClosePeerReview,
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
						},
					}
				};
			});
			currentPageReviews = page;
			totalPagesReviews = result.data.pages;
		}
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

	function formatDate(dateString: string) {
		const date = new Date(dateString);
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

	onMount(async () => {
		await getClassInfo(parseInt($page.params.id)).then((res) => {
			let r = res.data as any;
			if (r) {
				className.name = r.name;
			}
		});
		await fetchStudents(currentPageStudents);
		await fetchPeerReviews(currentPageReviews);
	});
</script>

<div>
	<h1 class="page-heading">{shortenedClassName}</h1>
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
			},
			{
				component: Button,
				tab: 1,
				props: {
					action: 'Bulk Add Students',
					onClick: () => {
						openModal({
							id: 'bulkAddStudents',
							title: 'Import Students',
							content: AddStudents,
							onSubmit: async () => {
								await fetchStudents(currentPageStudents);
								closeModal('bulkAddStudents');
							},
							onClose: () => {
								closeModal('bulkAddStudents');
							}
						});
					},
					animation: false,
					classNames: 'md:w-96'
				}
			}
		]}
	>
		<TabContent index={0} current={currentTab}>
			<Searchbar
				placeholder="Search for a peer review"
				onSearch={(value) => {
					filteredReviews = reviews.filter((review) => {
						return review.name.toLowerCase().includes(value.toLowerCase());
					});
				}}
			/>
			<Pagination
				currentPage={currentPageReviews}
				totalPages={totalPagesReviews}
				{nextPage}
				{prevPage}
			/>
			<Table columns={tabs[0].props.columns} bind:data={filteredReviews} />
		</TabContent>
		<TabContent index={1} current={currentTab}>
			<Searchbar
				placeholder="Search for a student"
				onSearch={(value) => {
					filteredStudents = students.filter((student) => {
						return student.name.toLowerCase().includes(value.toLowerCase());
					});
				}}
			/>
			<Pagination
				currentPage={currentPageStudents}
				totalPages={totalPagesStudents}
				{nextPage}
				{prevPage}
			/>
			<Table columns={tabs[1].props.columns} bind:data={filteredStudents} />
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
