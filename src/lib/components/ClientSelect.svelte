<script lang="ts" context="module">
	import { slide } from 'svelte/transition';
</script>

<script lang="ts">
	import Fuse from 'fuse.js';
	import type { RangeTuple } from 'fuse.js';
	import { Search } from 'lucide-svelte';
	export let clients: string[] = [];
	export let selectedClient: string | null = null;
	export let onClientChange: (client: string | null) => void;

	let isOpen = false;
	let searchTerm = '';
	let filteredClients: string[] = [];
	let matchesMap = new Map<string, readonly RangeTuple[]>();

	$: {
		if (searchTerm) {
			const fuse = new Fuse(clients, {
				threshold: 0.4,
				distance: 200,
				includeMatches: true,
				minMatchCharLength: 1
			});
			const searchResults = fuse.search(searchTerm);
			filteredClients = searchResults.map((result) => result.item);
			matchesMap = new Map(
				searchResults.map((result) => [result.item, result.matches?.[0]?.indices || []])
			);
		} else {
			filteredClients = clients;
			matchesMap = new Map();
		}
	}

	function handleSelect(value: string | null) {
		onClientChange(value);
		isOpen = false;
		searchTerm = '';
	}

	function toggleDropdown() {
		isOpen = !isOpen;
		if (!isOpen) {
			searchTerm = '';
		}
	}

	function highlightText(text: string, indices: readonly [number, number][]) {
		if (!indices.length) return text;

		let result = '';
		let lastIndex = 0;

		indices.forEach(([start, end]) => {
			result += text.slice(lastIndex, start);
			result += `<span class="bg-yellow-200 dark:bg-yellow-600">${text.slice(start, end + 1)}</span>`;
			lastIndex = end + 1;
		});

		result += text.slice(lastIndex);
		return result;
	}
</script>

<section
	class="relative rounded-lg bg-gray-50 p-6 shadow-sm transition-colors duration-200 dark:bg-gray-800"
>
	<h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Select Client</h2>
	<div class="relative {!selectedClient && !isOpen ? 'glow-border' : ''}">
		<button
			type="button"
			on:click={toggleDropdown}
			class="mt-1 flex w-full items-center justify-between rounded-md bg-white px-4 py-3 text-lg font-medium outline-none dark:bg-gray-700 dark:text-white"
		>
			<span>{selectedClient || 'Select a client...'}</span>
			<svg
				class="h-5 w-5 text-gray-400 transition-transform duration-200 {isOpen ? 'rotate-180' : ''}"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
			</svg>
		</button>

		{#if isOpen}
			<div
				class="fixed left-0 right-0 top-0 z-[100] mx-auto mt-1 max-w-[calc(100%-2rem)] overflow-hidden rounded-lg bg-gray-800 shadow-lg transition-all duration-200 ease-out dark:bg-gray-800 sm:relative sm:left-auto sm:right-auto sm:top-auto sm:w-full sm:max-w-none"
				style="max-height: 80vh;"
				in:slide={{ duration: 200 }}
				out:slide={{ duration: 200 }}
			>
				<div class="sticky top-0 z-[101] px-0 pb-2 pt-3 outline-none border-none">
					<div class="relative mb-2">
						<div class="pointer-events-none absolute inset-y-0 left-3 flex items-center">
							<Search class="h-5 w-5 text-gray-400 " />
						</div>
						<input
							type="text"
							placeholder="Search clients..."
							bind:value={searchTerm}
							class=" w-full rounded-lg bg-gray-700 py-3 pl-10 pr-4 text-base text-white outline-none border-none transition-colors duration-200 placeholder:text-gray-400 focus:bg-gray-600"
						/>
					</div>
				</div>
				<div class="max-h-[calc(80vh-4rem)] overflow-y-auto bg-gray-700 sm:max-h-[240px] rounded-lg">
					<button
						class="w-full px-4 py-1.5 text-left text-base hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600"
						on:click={() => handleSelect(null)}
					>
						Select a client...
					</button>
					{#each filteredClients as client}
						<button
							class="w-full px-4 py-1.5 text-left text-base hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600"
							on:click={() => handleSelect(client)}
						>
							{@html searchTerm ? highlightText(client, matchesMap.get(client) || []) : client}
						</button>
					{/each}
					{#if filteredClients.length === 0 && searchTerm}
						<div class="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">No results found</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</section>

<style>
	@keyframes borderGlow {
		0% {
			box-shadow:
				0 0 7px #3b82f6,
				0 0 15px rgba(59, 130, 246, 0.7),
				0 0 20px rgba(59, 130, 246, 0.5);
			border-color: #60a5fa;
			opacity: 0.9;
		}
		50% {
			box-shadow:
				0 0 10px #60a5fa,
				0 0 20px rgba(96, 165, 250, 0.8),
				0 0 30px rgba(96, 165, 250, 0.6);
			border-color: #93c5fd;
			opacity: 1;
		}
		100% {
			box-shadow:
				0 0 7px #3b82f6,
				0 0 15px rgba(59, 130, 246, 0.7),
				0 0 20px rgba(59, 130, 246, 0.5);
			border-color: #60a5fa;
			opacity: 0.9;
		}
	}

	.glow-border {
		position: relative;
	}

	.glow-border::before {
		content: '';
		position: absolute;
		inset: 0;
		border: 2px solid #60a5fa;
		border-radius: 0.5rem;
		animation: borderGlow 3s ease-in-out infinite;
		pointer-events: none;
	}
</style>
