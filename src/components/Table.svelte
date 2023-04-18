<script lang="ts">
	interface Row {
		[key: string]: any;
	}

	interface Column {
		name: string;
		key: string;
		sortable: boolean;
		searchable: boolean;
	}

	interface Action {
		label: string;
		onClick: (row: Row) => void;
	}

	export let columns: Column[] = [];

	export let data: Row[] = [];

	export let onAdd: () => void = () => {};
	export let actionEnabled = false;
</script>

<div class="overflow-hidden rounded-lg border border-gray-200">
	<table class="w-full border-collapse bg-white text-left text-sm text-gray-500">
		<thead class="bg-inputbg">
			<tr>
				{#each columns as column}
					<th class="px-6 py-4 font-medium text-gray-900">{column.name}</th>
				{/each}
				{#if actionEnabled}
					<th class="text-right pr-5">
						<button on:click={onAdd}>
							<span class="flex flex-row">
								<svg
									class="w-6 h-6"
									fill="none"
									stroke="#112E51"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 4v16m8-8H4"
									/>
								</svg>
								<p class="ml-2 self-center text-primary align-right">Add</p>
							</span>
						</button>
					</th>
				{/if}
			</tr>
		</thead>
		<tbody class="divide-y divide-gray-100 border-t border-gray-100">
			{#each data as row}
				<tr class="hover:bg-gray-50">
					{#each columns as column}
						{#if column.key === 'actions'}
							<td class="px-6 py-4 text-right">
								{#each Object.entries(row[column.key]) as [key, action]}
									<button
										class="px-3 py-1 mr-2 rounded-md bg-primary text-white"
										on:click={() => action.onClick(row)}
									>
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
			{#if data.length === 0}
				<tr>
					<td colspan={columns.length} class="px-6 py-4 text-center"> No data to display </td>
				</tr>
			{/if}
		</tbody>
	</table>
</div>
