<script>
	import IconButton from './IconButton.svelte';
	import { EyeIcon } from 'svelte-feather-icons';
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
			key: 'Score',
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
			name: '',
			key: 'actions',
			sortable: false,
			searchable: false
		}
	];

	export let data = [
		{
			name: 'Assignment 1',
			email: 'test@gmail.com',
			status: 'Open',
			group: 'Group 1',
			last_submission: '2021-05-01 12:00:00',
            score: 100,
            maxScore: 100,
			tags: ['Design', 'Product', 'Develop'],
			actions: ''
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
					<td class="flex gap-3 px-6 py-4 font-normal text-gray-900">
						<div class="text-sm">
							<div class="font-medium text-gray-700">{row.name}</div>
							<!-- <div class="text-gray-400">{row.email}</div> -->
						</div>
					</td>
					<td class="px-6 py-4">
						<span
							class="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600"
						>
							<span class="h-1.5 w-1.5 rounded-full bg-green-600" />
							{row.status}
						</span>
					</td>
					<td class="px-6 py-4">{row.group}</td>
					<td class="px-6 py-4 font-bold">{`${row.score} / ${row.maxScore}`}</td>
					<td class="px-6 py-4">{row.last_submission}</td>
					<td class="px-6 py-4">
						<div class="flex justify-end gap-4">
							<IconButton
								icon={EyeIcon}
								text="View"
								onClick={() => console.log('View')}
							/>
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<!-- <div class="flex gap-2">
    <span
        class="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600"
    >
        Design
    </span>
    <span
        class="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-600"
    >
        Product
    </span>
    <span
        class="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-1 text-xs font-semibold text-violet-600"
    >
        Develop
    </span>
</div> -->
