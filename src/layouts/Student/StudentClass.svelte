<script lang="ts">
	import Table from '$components/Table.svelte';
	import { getPeerReviewAssignments, type ExtendedAPIResponse, getClassInfo } from '$lib/api/api';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import Pagination from '$components/Pagination.svelte';
	import { goto } from '$app/navigation';
	import { className } from '$lib/stores/info';

	let currentPage = 0;
	let total = 0;

	let table = {
		name: 'Peer Review Assignments',
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
					key: 'due_date',
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
					name: 'Score',
					key: 'score',
					sortable: false,
					searchable: false
				},
				{
					name: '',
					key: 'actions',
					sortable: false,
					searchable: false
				}
			]
		}
	};

	const fetchPRAssignments = async (page: number) => {
		await getPeerReviewAssignments({ page: page, class_id: $page.params.id }).then((res) => {
			let r = res.data as any;
			if (r.assignments) {
				table.props.data = r.assignments.map((a: any) => {
					return {
						name: a.peer_reviews.name,
						due_date: new Date(a.peer_reviews.due_date).toLocaleDateString(),
						status: a.status,
						score: `${a.final_score} / ${a.peer_reviews.templates.max_points}`,
						id: a.id,
						actions: {
						}
					};
				});


				// Update actions for each table prop data row
				table.props.data.forEach((row: any) => {

					if (row.status === 'assigned') {
						row.actions = {
							start: {
								label: 'Start',
								onClick: (row: any) => {
									goto(`/class/${$page.params.id}/assignment/${row.id}`);
								}
							}
						};
						return;
					}

					if (row.status === 'closed') {
						row.actions = {
						};
						return;
					}
				});

				currentPage = page;
				total = r.pages;
			}
		});
	};

	onMount(() => {
		getClassInfo(parseInt($page.params.id)).then((res) => {
			let r = res.data as any;

			if (r) {
				className.name = r.name;
			}
		});
		fetchPRAssignments(0);
	});
</script>

<div>
	<h1 class="page-heading">{className.name}</h1>
	<h2 class="subheading">Peer Review Assignments</h2>
	<Pagination
		currentPage={currentPage}
		totalPages={total}
	/>
	<Table {...table.props} />
</div>

<style>
	.page-heading {
		@apply font-bold text-3xl mt-2;
	}

	.subheading {
		@apply font-bold text-2xl mt-[5rem] text-primary;
	}
</style>
