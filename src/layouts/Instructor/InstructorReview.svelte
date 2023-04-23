<script lang="ts">
	import ActionButton from '$components/ActionButton.svelte';
	import Modal from '$components/Modal.svelte';
	import PeerReview from '$components/Modals/CreatePeerReview.svelte';
	import TabContent from '$components/TabContent.svelte';
	import Table from '$components/Table.svelte';
	import Tabs from '$components/Tabs.svelte';
	import { ChevronLeftIcon } from 'svelte-feather-icons';
	import { onMount } from 'svelte';
	import CreateGroup from '$components/Modals/CreateGroup.svelte';
	import {
		fetchGroups,
		type ExtendedAPIResponse,
		getSubmissions,
		getScores,
		getReview,
		getClassInfo
	} from '$lib/api/api';
	import { page } from '$app/stores';
	import Pagination from '$components/Pagination.svelte';
	import Button from '$components/Button.svelte';
	import { goto } from '$app/navigation';
	import { utils, writeFile } from 'xlsx';
	import { className, peerReview } from '$lib/stores/info';
	import RandomizeGroup from '$components/Modals/RandomizeGroup.svelte';
	import DeleteGroup from '$components/Modals/DeleteGroup.svelte';
	import OmitScore from '$components/Modals/OmitScore.svelte';
	import UnomitScore from '$components/Modals/UnomitScore.svelte';
	import Searchbar from '$components/Searchbar.svelte';

	let tabs = [
		{
			name: 'Scores',
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
						name: 'Score',
						key: 'score',
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
			name: 'Submissions',
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
						name: 'Score',
						key: 'score',
						sortable: true,
						searchable: true
					},
					{
						name: 'Omitted',
						key: 'omit',
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
			name: 'Groups',
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

	let currentPageSubmissions = 0;
	let totalPagesSubmssions = 0;
	let currentPageGroups = 0;
	let totalPagesGroups = 0;
	let currentPageScores = 0;
	let totalPagesScores = 0;

	const openModal = (data: any) => {
		modals = [...modals, data];
	};

	const closeModal = (modalId: any) => {
		modals = modals.filter((modal: any) => modal.id !== modalId);
	};

	const nextPage = () => {
		if (currentTab === 0) {
			if (currentPageSubmissions < totalPagesSubmssions - 1) {
				currentPageSubmissions++;
			}
		} else if (currentTab === 1) {
			if (currentPageGroups < totalPagesGroups - 1) {
				currentPageGroups++;
			}
		}
	};

	const prevPage = () => {
		if (currentTab === 0) {
			if (currentPageSubmissions > 0) {
				currentPageSubmissions--;
			}
		} else if (currentTab === 1) {
			if (currentPageGroups > 0) {
				currentPageGroups--;
			}
		}
	};

	const goBack = () => {
		window.history.back();
	};

	const getGroups = async (page: number) => {
		await fetchGroups({
			page: page,
			peer_review_id: $page.url.pathname.split('/')[4]
		}).then((res) => {
			let r = res as ExtendedAPIResponse;
			if (r.status === 200) {
				tabs[2].props.data = r.data.groups.map((pr: any) => {
					console.log(r.data.groups);
					return {
						name: pr.name,
						actions: {
							view: {
								label: 'View',
								icon: 'eye',
								onClick: (row: any) => {
									// Format needs to be /class/:id/review/:peer_review_id/group/:group_id
									goto(
										`/class/${$page.url.pathname.split('/')[2]}/review/${
											$page.url.pathname.split('/')[4]
										}/group/${pr.id}`
									);
								}
							},
							delete: {
								label: 'Delete',
								icon: 'delete',
								actionColor: 'text-red-500',
								onClick: (row: any) => {
									openModal({
										id: 'deleteGroup',
										title: 'Delete Group',
										content: DeleteGroup,
										onSubmit: async () => {
											await getGroups(currentPageGroups);
											closeModal('deleteGroup');
										},
										onClose: () => {
											closeModal('deleteGroup');
										},
										props: {
											group_id: pr.id
										}
									});
								}
							}
						}
					};
				});

				/*table[2].props.data.forEach((row: any) => {
					if ()
				});*/

				currentPageGroups = page;
				totalPagesGroups = r.data.pages;
			} else {
			}
		});
	};

	$: filteredSubmissions = tabs[1].props.data

	const retrieveSubmissions = async (page: number) => {
		getSubmissions({
			peer_review_id: parseInt($page.url.pathname.split('/')[4]),
			page: page
		}).then((res) => {
			let r = res as ExtendedAPIResponse;
			if (r.status === 200) {
				tabs[1].props.data = r.data.submissions.map((pr: any) => {
					return {
						name: pr.users.name,
						email: pr.users.email,
						score: pr.score,
						omit: pr.omit ? 'Yes' : 'No',
						actions: {
							unomit: {
								label: 'Unomit',
								onClick: (row: any) => {
									openModal({
										id: 'unomitSubmission',
										title: 'Un-omit Submission',
										content: UnomitScore,
										onSubmit: async () => {
											await retrieveSubmissions(currentPageSubmissions);
											closeModal('unomitSubmission');
										},
										onClose: () => {
											closeModal('unomitSubmission');
										},
										props: {
											submission_id: pr.id
										}
									});
								}
							},
							omit: {
								label: 'Omit',
								icon: 'delete',
								actionColor: 'text-red-500',
								onClick: (row: any) => {
									openModal({
										id: 'omitSubmission',
										title: 'Omit Submission',
										content: OmitScore,
										onSubmit: async () => {
											await retrieveSubmissions(currentPageSubmissions);
											closeModal('omitSubmission');
										},
										onClose: () => {
											closeModal('omitSubmission');
										},
										props: {
											submission_id: pr.id
										}
									});
								}
							},
						}
					};
				});

				currentPageSubmissions = page;
				totalPagesSubmssions = r.data.pages;
			} else {
			}
		});
	};

	const retrieveScores = async (page: number) => {
		getScores({
			review_id: parseInt($page.url.pathname.split('/')[4]),
			page: page
		}).then((res) => {
			let r = res as ExtendedAPIResponse;
			if (r.status === 200) {
				tabs[0].props.data = r.data.assignments.map((pr: any) => {
					return {
						name: pr.student_name,
						email: pr.student_email,
						score: `${pr.final_score} / ${pr.max_score}`,
						actions: {}
					};
				});

				currentPageScores = page;
				totalPagesScores = r.data.pages;
			} else {
			}
		});
	};

	function getColumnWidths(header: any, data: any) {
		const widths = header.map((h: any) => ({ wch: h.toString().length }));

		data.forEach((row: any) => {
			row.forEach((cell: any, i: any) => {
				const cellLength = cell.toString().length;
				if (widths[i].wch < cellLength) {
					widths[i].wch = cellLength;
				}
			});
		});

		return widths;
	}

	const generateScoreReport = async () => {
		let pageN = 0;
		let total_pages = 1;

		let scores: any = [];

		while (pageN < total_pages) {
			await getScores({
				review_id: parseInt($page.params.id),
				page: pageN
			}).then((res) => {
				let r = res as ExtendedAPIResponse;
				console.log(r);
				if (r.status === 200) {
					total_pages = r.data.pages;
					scores = [...scores, ...r.data.assignments];
				}
			});
			pageN++;
		}

		console.log(scores);

		// Create a new workbook
		const workbook = utils.book_new();

		// Create an array with the header row
		const header = ['Student Name', 'Student Email', 'Final Score', 'Max Score'];

		// Convert the scores array to an array of arrays
		const scoresData = scores.map((score) => [
			score.student_name,
			score.student_email,
			score.final_score,
			score.max_score
		]);

		// Combine the header and data arrays
		const sheetData = [header, ...scoresData];

		// Calculate column widths based on the header and data
		const columnWidths = getColumnWidths(header, scoresData);

		// Create a new worksheet with the sheet data
		const worksheet = utils.aoa_to_sheet(sheetData);

		// Set the 'cols' attribute of the worksheet with the calculated column widths
		worksheet['!cols'] = columnWidths;

		// Add the worksheet to the workbook
		utils.book_append_sheet(workbook, worksheet, 'Score Report');

		// Export the workbook as a file (e.g., XLSX)
		const fileName = `score_report_${new Date().toISOString()}.xlsx`;
		writeFile(workbook, fileName, { bookType: 'xlsx' });
	};

	onMount(async () => {
		await getGroups(0);
		await retrieveSubmissions(0);
		await retrieveScores(0);

		await getReview({ peer_review_id: parseInt($page.params.id) }).then((res) => {
			if (res.status === 200) {
				peerReview.name = res.data.name;
			}
		});

		// Class id
		const classId = $page.url.pathname.split('/')[2];

		// Class name
		await getClassInfo(parseInt(classId)).then((res) => {
			let r = res.data as any;
			if (r) {
				className.name = r.name;
			}
		});
	});
</script>

<div>
	<div class="page-heading">{className.name}</div>
	<div class="flex flex-col md:flex-row">
		<div class="flex flex-row subheading">
			<div on:click={goBack} on:keyup={goBack}>
				<ChevronLeftIcon class="cursor-pointer mt-1" />
			</div>
			<h2 class="ml-5">{peerReview.name}</h2>
		</div>
	</div>
	<Tabs
		bind:currentTab
		{tabs}
		actionButtons={[
			{
				component: ActionButton,
				tab: 0,
				props: {
					action: 'Generate Score Report',
					onClick: generateScoreReport,
					animation: false,
					classNames: 'md:w-72'
				}
			},
			{
				component: ActionButton,
				tab: 2,
				props: {
					action: 'Create Group',
					onClick: () => {
						openModal({
							id: 'addPeerReview',
							title: 'Create New Group',
							content: CreateGroup,
							onSubmit: async () => {
								await getGroups(currentPageGroups);
								closeModal('addPeerReview');
							},
							onClose: () => {
								closeModal('addPeerReview');
							},
							props: {
								class_id: parseInt($page.url.pathname.split('/')[2])
							}
						});
					},
					animation: false,
					classNames: 'md:self-center'
				}
			},
			{
				component: Button,
				tab: 2,
				props: {
					action: 'Auto-Create and Assign Groups',
					onClick: () => {
						openModal({
							id: 'randomizeGroup',
							title: 'Auto-Create and Assign Groups',
							content: RandomizeGroup,
							onSubmit: async () => {
								closeModal('randomizeGroup');
							},
							onClose: () => {
								closeModal('randomizeGroup');
							},
							props: {
								review_id: parseInt($page.url.pathname.split('/')[4])
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
				currentPage={currentPageScores}
				totalPages={totalPagesScores}
				{nextPage}
				{prevPage}
			/>
			<Table {...tabs[currentTab].props} />
		</TabContent>
		<TabContent index={1} current={currentTab}>
			<Searchbar onSearch={(search) => {
				filteredSubmissions = tabs[1].props.data.filter((submission) => {
					return submission.name.toLowerCase().includes(search.toLowerCase());
				});
			}} />
			<Pagination
				currentPage={currentPageSubmissions}
				totalPages={totalPagesSubmssions}
				{nextPage}
				{prevPage}
			/>
			<Table columns={tabs[currentTab].props.columns} data={filteredSubmissions}/>
		</TabContent>
		<TabContent index={2} current={currentTab}>
			<Pagination
				currentPage={currentPageGroups}
				totalPages={totalPagesGroups}
				{nextPage}
				{prevPage}
			/>
			<Table {...tabs[currentTab].props} />
		</TabContent>
	</Tabs>
</div>
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
