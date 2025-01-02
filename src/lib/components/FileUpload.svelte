<script lang="ts">
	import { Upload, FileText } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';

	export let csvFile: File | null = null;
	export let csvError: string | null = null;

	const dispatch = createEventDispatcher<{
		reset: void;
		upload: { file: File };
	}>();

	function handleReset() {
		dispatch('reset');
	}

	function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files?.[0]) {
			dispatch('upload', { file: target.files[0] });
		}
	}
</script>

<section
	class="{!csvFile
		? 'mx-auto max-w-2xl'
		: ''} rounded-lg bg-gray-50 p-6 shadow-sm transition-colors duration-200 dark:bg-gray-800"
>
	<h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Upload Time Report</h2>
	{#if csvFile}
		<div
			class="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-700"
		>
			<div class="flex items-center gap-3">
				<FileText class="h-6 w-6 text-blue-500 dark:text-blue-400" />
				<div>
					<p class="font-medium text-gray-900 dark:text-white">{csvFile.name}</p>
				</div>
			</div>
			<button
				on:click={handleReset}
				class="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
			>
				Upload Another
			</button>
		</div>
	{:else}
		<div class="flex w-full items-center justify-center">
			<label
				for="file-upload"
				class="flex w-full cursor-pointer flex-col items-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
			>
				<div class="flex flex-col items-center justify-center pb-6 pt-5">
					<Upload class="mb-3 h-10 w-10 text-gray-400" />
					<p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
						<span class="font-semibold">Click to upload</span> or drag and drop
					</p>
					<p class="text-xs text-gray-500 dark:text-gray-400">CSV files only</p>
				</div>
				<input
					id="file-upload"
					type="file"
					accept=".csv"
					on:change={handleFileChange}
					class="hidden"
				/>
			</label>
		</div>
	{/if}
	{#if csvError}
		<p class="mt-2 text-red-600 dark:text-red-400">{csvError}</p>
	{/if}
</section>
