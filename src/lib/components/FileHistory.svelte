<script lang="ts">
	import { getHistory, removeFromHistory } from '$lib/utils/fileHistory';
	import { FileText, Clock, X, Trash2 } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';

	let history = getHistory();
	const dispatch = createEventDispatcher<{
		select: { entry: (typeof history)[number] };
	}>();

	function handleSelect(entry: (typeof history)[number]) {
		dispatch('select', { entry });
	}

	function handleRemove(event: Event, name: string) {
		event.stopPropagation(); 
		removeFromHistory(name);
		history = getHistory();
	}

	function clearAllHistory() {
		localStorage.removeItem('csv_file_history');
		history = [];
	}

	
	function formatRelativeTime(timestamp: number): string {
		const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
		const diff = timestamp - Date.now();
		const diffDays = Math.round(diff / (1000 * 60 * 60 * 24));
		const diffHours = Math.round(diff / (1000 * 60 * 60));
		const diffMinutes = Math.round(diff / (1000 * 60));

		if (Math.abs(diffDays) >= 1) {
			return rtf.format(diffDays, 'day');
		} else if (Math.abs(diffHours) >= 1) {
			return rtf.format(diffHours, 'hour');
		} else {
			return rtf.format(diffMinutes, 'minute');
		}
	}
</script>

{#if history.length > 0}
	<div class="mx-auto mt-4 max-w-2xl space-y-2">
		<div class="flex items-center justify-between">
			<h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Recent Files</h3>
			<div class="group relative">
				<button
					class="flex items-center gap-1 rounded-lg p-1 text-sm text-gray-500 hover:bg-gray-100 hover:text-red-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-red-400"
					on:click={clearAllHistory}
				>
					<Trash2 class="h-4 w-4" />
				</button>
				<div
					class="pointer-events-none absolute -left-8 -top-10 hidden whitespace-nowrap rounded bg-gray-900 px-3 py-1.5 text-xs text-white group-hover:block dark:bg-gray-700"
				>
					Clear all
				</div>
			</div>
		</div>
		<div class="space-y-2">
			{#each history as entry}
				<div
					class="group flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-3 transition-all hover:scale-[1.01] hover:border-blue-500 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-400"
					on:click={() => handleSelect(entry)}
					on:keydown={(e) => e.key === 'Enter' && handleSelect(entry)}
					role="button"
					tabindex="0"
				>
					<div class="flex flex-1 items-center gap-3">
						<FileText class="h-5 w-5 text-blue-500 dark:text-blue-400" />
						<div class="flex-1">
							<p class="text-sm font-medium text-gray-900 dark:text-white">{entry.name}</p>
							<p class="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
								<Clock class="h-3 w-3" />
								{formatRelativeTime(entry.lastUsed)}
							</p>
						</div>
					</div>
					<button
						class="rounded p-1 opacity-0 transition-opacity hover:bg-gray-100 group-hover:opacity-100 dark:hover:bg-gray-700"
						on:click={(e) => handleRemove(e, entry.name)}
					>
						<X class="h-4 w-4 text-gray-500 dark:text-gray-400" />
					</button>
				</div>
			{/each}
		</div>
	</div>
{/if}
