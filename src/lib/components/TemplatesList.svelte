<script lang="ts">
	import type { Template } from '$lib/utils/storage';
	import { loadTemplates } from '$lib/utils/storage';
	import { FileText, CheckCircle, Clock, Briefcase } from 'lucide-svelte';
	import toast, { Toaster } from 'svelte-french-toast';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{
		loadTemplate: { clientName: string; template: Template };
	}>();

	let templates: Record<string, Template> = loadTemplates();

	function loadTemplate(clientName: string, template: Template) {
		dispatch('loadTemplate', { clientName, template });
		toast.success(`Template for ${clientName} loaded`, {
			icon: CheckCircle
		});
	}
</script>

<Toaster />

{#if Object.keys(templates).length === 0}
	<p class="text-gray-500 dark:text-gray-400">No templates saved yet.</p>
{:else}
	<div class="grid gap-4 sm:grid-cols-2">
		{#each Object.entries(templates) as [clientName, template]}
			<button
				on:click={() => loadTemplate(clientName, template)}
				class="rounded-lg border border-gray-200 bg-gray-50 p-4 text-left transition-colors duration-200 hover:border-blue-500 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-700 dark:hover:border-blue-400 dark:hover:bg-gray-600"
			>
				<div class="mb-2">
					<h3 class="font-semibold text-gray-900 dark:text-white">{clientName}</h3>
				</div>
				<div class="space-y-1 text-sm text-gray-600 dark:text-gray-300">
					<p class="flex items-center gap-2">
						<FileText class="h-4 w-4" />
						{template.data.clientDetails?.email || 'N/A'}
					</p>
					<p class="flex items-center gap-2">
						<Clock class="h-4 w-4" />
						{template.data.timeEntries?.length || 0} time entries ({(
							template.data.timeEntries || []
						)
							.reduce((total, entry) => total + entry.hours, 0)
							.toFixed(1)}h)
					</p>
					<p class="flex items-center gap-2">
						<Briefcase class="h-4 w-4" />
						{new Set((template.data.timeEntries || []).map((entry) => entry.project)).size} projects
					</p>
				</div>
			</button>
		{/each}
	</div>
{/if}
