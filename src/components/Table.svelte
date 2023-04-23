<script lang="ts">
	import { onMount } from "svelte";
	import { ChevronDownIcon, DeleteIcon, EditIcon, EyeIcon, LockIcon, TrashIcon } from "svelte-feather-icons";

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
					{#if column.key === 'actions'}
						<th class="px-6 py-4 font-medium text-gray-900 w-48">
						</th>
					{:else}
						<th class="px-6 py-4 font-medium text-gray-900">{column.name}</th>
					{/if}
				{/each}
			</tr>
		</thead>
		<tbody class="divide-y divide-gray-100 border-t border-gray-100">
			{#each data as row}
				<tr class="hover:bg-gray-50">
					{#each columns as column}
						{#if column.key === 'actions'}
							<td class="flex flex-row px-6 py-4 text-right">
								{#each Object.entries(row[column.key]) as [key, action]}
								<div class="flex flex-row ml-auto">
									{#if action.icon}
										{#if action.icon === 'delete'}
											<TrashIcon class="w-5 h-5 self-center text-red-500" />
										{:else if action.icon === 'edit'}
											<EditIcon class="w-5 h-5 self-center text-primary" />
										{:else if action.icon === 'close'}
											<LockIcon class="w-5 h-5 self-center text-red-500" />
										{:else if action.icon === 'eye'}
											<EyeIcon class="w-5 h-5 self-center text-primary" />
										{/if}
									{/if}
									<button
										class={`px-3 py-1 mr-2 rounded-md text-primary font-semibold ${action.actionColor || 'text-primary'}`}
										on:click={() => action.onClick(row)}
									>
										{action.label}
									</button>
								</div>
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
