<script lang="ts">
	import type { TimeEntry } from '$lib/types';
	import { createEventDispatcher } from 'svelte';
	import { Trash2, Plus, User, FileText, DollarSign } from 'lucide-svelte';

	export let entries: TimeEntry[] = [];
	export let defaultRate: number = 0;

	const dispatch = createEventDispatcher<{
		update: { entries: TimeEntry[] };
	}>();

	function addEntry() {
		entries = [
			...entries,
			{
				item: '',
				clientFirstName: '',
				clientLastName: '',
				notes: '',
				hours: entries.length > 0 ? entries[entries.length - 1].hours : 1,
				rate: defaultRate || (entries.length > 0 ? entries[entries.length - 1].rate : 100),
				amount: 0
			}
		];
		const newEntry = entries[entries.length - 1];
		newEntry.amount = newEntry.hours * newEntry.rate;
		dispatch('update', { entries });
	}

	function removeEntry(index: number) {
		entries = entries.filter((_, i) => i !== index);
		dispatch('update', { entries });
	}

	function updateEntry(index: number, field: keyof TimeEntry, value: string | number) {
		entries = entries.map((entry, i) => {
			if (i === index) {
				const updatedEntry = { ...entry };
				if (field === 'hours') {
					const hours = parseFloat(value as string) || 0;
					updatedEntry.hours = hours;
					updatedEntry.amount = hours * entry.rate;
				} else if (field === 'rate') {
					const rate = Number(value) || 0;
					updatedEntry.rate = rate;
					updatedEntry.amount = entry.hours * rate;
				} else if (
					field === 'item' ||
					field === 'clientFirstName' ||
					field === 'clientLastName' ||
					field === 'notes'
				) {
					updatedEntry[field] = value as string;
				}
				return updatedEntry;
			}
			return entry;
		});
		dispatch('update', { entries });
	}
</script>

<section
	class="rounded-lg bg-gray-50 p-6 shadow-sm transition-colors duration-200 dark:bg-gray-800"
>
	<div class="mb-6 flex items-center justify-between">
		<h2 class="text-xl font-semibold text-gray-900 dark:text-white">Time Entries</h2>
		<button
			on:click={addEntry}
			class="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
		>
			<Plus class="h-4 w-4" />
			Add Entry
		</button>
	</div>

	<div class="space-y-6">
		{#each entries as entry, index}
			<div
				class="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
			>
				<div class="mb-4 flex items-center justify-between">
					<h3 class="text-lg font-medium text-gray-900 dark:text-white">Entry {index + 1}</h3>
					<button
						on:click={() => removeEntry(index)}
						class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600"
					>
						<Trash2 class="h-4 w-4" />
					</button>
				</div>

				<div class="grid gap-4 md:grid-cols-2">
					<div>
						<label
							for="item-{index}"
							class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							<FileText class="h-4 w-4" />
							Item/Service
						</label>
						<input
							type="text"
							id="item-{index}"
							value={entry.item}
							on:input={(e) => updateEntry(index, 'item', e.currentTarget.value)}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
						/>
					</div>

					<div class="grid grid-cols-2 gap-4">
						<div>
							<label
								for="client-firstname-{index}"
								class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
							>
								<User class="h-4 w-4" />
								Client First Name
							</label>
							<input
								type="text"
								id="client-firstname-{index}"
								value={entry.clientFirstName}
								on:input={(e) => updateEntry(index, 'clientFirstName', e.currentTarget.value)}
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
							/>
						</div>

						<div>
							<label
								for="client-lastname-{index}"
								class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
							>
								<User class="h-4 w-4" />
								Client Last Name
							</label>
							<input
								type="text"
								id="client-lastname-{index}"
								value={entry.clientLastName}
								on:input={(e) => updateEntry(index, 'clientLastName', e.currentTarget.value)}
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
							/>
						</div>
					</div>

					<div class="md:col-span-2">
						<label
							for="notes-{index}"
							class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							<FileText class="h-4 w-4" />
							Notes
						</label>
						<textarea
							id="notes-{index}"
							value={entry.notes}
							on:input={(e) => updateEntry(index, 'notes', e.currentTarget.value)}
							rows="2"
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
						></textarea>
					</div>

					<div class="grid grid-cols-2 gap-4 md:col-span-2">
						<div class="space-y-4">
							<div>
								<label
									for="hours-{index}"
									class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
								>
									<FileText class="h-4 w-4" />
									Hours Worked
								</label>
								<div class="relative">
									<input
										type="number"
										id="hours-{index}"
										value={entry.hours}
										step="0.1"
										min="0"
										on:input={(e) => updateEntry(index, 'hours', e.currentTarget.value)}
										class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
									/>
									<div
										class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
									>
										<span class="text-sm text-gray-500 dark:text-gray-400">hrs</span>
									</div>
								</div>
								<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
									Enter the total hours worked for this task
								</p>
							</div>
						</div>

						<div class="space-y-4">
							<div>
								<label
									for="rate-{index}"
									class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
								>
									<DollarSign class="h-4 w-4" />
									Hourly Rate
								</label>
								<div class="relative">
									<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
										<span class="text-gray-500 dark:text-gray-400">$</span>
									</div>
									<input
										type="number"
										id="rate-{index}"
										value={entry.rate}
										step="0.01"
										min="0"
										placeholder={defaultRate.toString()}
										on:input={(e) => updateEntry(index, 'rate', e.currentTarget.value)}
										class="mt-1 block w-full rounded-md border-gray-300 pl-7 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
									/>
									<div
										class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
									>
										<span class="text-sm text-gray-500 dark:text-gray-400">/hr</span>
									</div>
								</div>
								<div class="mt-2 flex flex-wrap gap-2">
									{#each [50, 75, 100, 125, 150, 200] as rate}
										<button
											on:click={() => updateEntry(index, 'rate', rate)}
											class="rounded-md bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
										>
											${rate}
										</button>
									{/each}
								</div>
								<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
									{defaultRate ? `Default rate: $${defaultRate.toFixed(2)}/hr` : 'Set hourly rate'}
								</p>
							</div>
						</div>
					</div>

					<div class="mt-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-700 md:col-span-2">
						<div class="flex items-center justify-between">
							<div>
								<h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">
									Calculated Amount
								</h4>
								<p class="text-sm text-gray-500 dark:text-gray-400">
									{entry.hours} hrs × ${entry.rate}/hr
								</p>
							</div>
							<div class="text-right">
								<span class="text-2xl font-bold text-gray-900 dark:text-white">
									${entry.amount.toFixed(2)}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>
</section>
