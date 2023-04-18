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
	import { fetchGroups, type ExtendedAPIResponse, getSubmissions, getScores } from '$lib/api/api';
	import { page } from '$app/stores';
	import Pagination from '$components/Pagination.svelte';
	import Button from '$components/Button.svelte';
	import { goto } from '$app/navigation';

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
						name: '',
						key: 'actions',
						sortable: false,
						searchable: false
					}
				]
			}
		},
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

	const retrieveSubmissions = async (page: number) => {
		getSubmissions({
			peer_review_id: parseInt($page.url.pathname.split('/')[4]),
			page: page,
            group_id: parseInt($page.params.id)
		}).then((res) => {
			let r = res as ExtendedAPIResponse;
			console.log(res)
			if (r.status === 200) {

				tabs[1].props.data = r.data.submissions.map((pr: any) => {
					console.log(pr);
					return {
						name: pr.users.name,
						email: pr.users.email,
						score: pr.score ? pr.score : 'Not yet determined.',
						actions: {
						}
					};
				});

				currentPageSubmissions = page;
				totalPagesSubmssions = r.data.pages;
			} else {
			}
		});
	}

	const retrieveScores = async (page: number) => {
		getScores({
			review_id: parseInt($page.url.pathname.split('/')[4]),
			page: page,
            group_id: parseInt($page.params.id)
		}).then((res) => {
			let r = res as ExtendedAPIResponse;
			console.log(res)
			if (r.status === 200) {
				tabs[0].props.data = r.data.assignments.map((pr: any) => {
					console.log(pr);
					return {
						name: pr.student_name,
						email: pr.student_email,
						score: `${pr.final_score} / ${pr.max_score}`,
						actions: {
						}
					};
				});

				currentPageScores = page;
				totalPagesScores = r.data.pages;
			} else {
			}
		});
	}

	onMount(async () => {
		await retrieveSubmissions(0);
		await retrieveScores(0);
	});
</script>

<div>
	<div class="flex flex-col md:flex-row">
		<div class="flex flex-row subheading">
			<div on:click={goBack} on:keyup={goBack}>
				<ChevronLeftIcon class="cursor-pointer mt-1" />
			</div>
			<h2 class="ml-5">Group</h2>
		</div>
	</div>
	<Tabs bind:currentTab {tabs}>
		<TabContent index={0} current={currentTab}>
			<Pagination
				currentPage={currentPageScores}
				totalPages={totalPagesScores}
				nextPage={nextPage}
				prevPage={prevPage}
			/>
			<Table
				{...tabs[currentTab].props}
			/>
		</TabContent>
		<TabContent index={1} current={currentTab}>
			<Pagination
				currentPage={currentPageSubmissions}
				totalPages={totalPagesSubmssions}
				nextPage={nextPage}
				prevPage={prevPage}
			/>
			<Table
				{...tabs[currentTab].props}
			/>
		</TabContent> 
	</Tabs>
</div>
<div>
	{#each modals as modal}
		<Modal title={modal.title} showModal={true} onSubmit={modal.onSubmit} onClose={modal.onClose}>
			{#if modal.content}
				<svelte:component this={modal.content} onSubmit={modal.onSubmit} onClose={modal.onClose} {...modal.props} />
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
