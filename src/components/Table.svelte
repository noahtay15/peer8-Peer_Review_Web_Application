<script lang="ts">
	interface Row {
		[key: string]: any;
	}

	interface Action {
		label: string;
		onClick: (row: Row) => void;
	}

	export let columns = [
		{
			name: 'Name',
			key: 'name',
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
			name: 'Group',
			key: 'group',
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
			name: 'Last Submission',
			key: 'last_submission',
			sortable: true,
			searchable: true
		},
		{
			name: 'Actions',
			key: 'actions',
			sortable: false,
			searchable: false
		}
	];

	export let data: Row[] = [
		{
			name: 'Assignment 1',
			email: 'test@gmail.com',
			status: 'Open',
			group: 'Group 1',
			last_submission: '2021-05-01 12:00:00',
			score: 100,
			maxScore: 100,
			tags: ['Design', 'Product', 'Develop'],
			actions: {
				edit: {
					label: 'Edit',
					onClick: (row: any) => {
						console.log(`Editing ${row.name}`);
					}
				},
				delete: {
					label: 'Delete',
					onClick: (row: any) => {
						console.log(`Deleting ${row.name}`);
					}
				},
				view: {
					label: 'View',
					onClick: (row: any) => {
						console.log(`Viewing ${row.name}`);
					}
				}
			}
		}
	];
</script>

<div class="overflow-hidden rounded-lg border border-gray-200 mt-10">
	<table class="w-full border-collapse bg-white text-left text-sm text-gray-500">
		<thead class="bg-inputbg">
			<tr>
				{#each columns as column}
					<th class="px-6 py-4 font-medium text-gray-900">{column.name}</th>
				{/each}
			</tr>
		</thead>
		<tbody class="divide-y divide-gray-100 border-t border-gray-100">
			{#each data as row}
				<tr class="hover:bg-gray-50">
					{#each columns as column}
						{#if column.key === 'actions'}
							<td class="px-6 py-4 text-right">
								{#each Object.entries(row[column.key]) as [key, action]}
									<button class="px-3 py-1 mr-2 rounded-md bg-primary text-white"
										on:click={() => action.onClick(row)}>
										{action.label}
									</button>
								{/each}
							</td>
						{:else}
							<td class="px-6 py-4">
								{row[column.key]}
							</td>
						{/if}
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>

