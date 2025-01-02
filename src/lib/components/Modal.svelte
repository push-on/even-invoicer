<script lang="ts">
	import { X } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';
	import { fade, scale } from 'svelte/transition';

	export let title: string;
	export let isOpen = false;

	const dispatch = createEventDispatcher<{
		close: void;
	}>();

	function close() {
		dispatch('close');
	}
</script>

{#if isOpen}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center"
		on:click|self={close}
		on:keydown|self={(e) => e.key === 'Escape' && close()}
		role="button"
		tabindex="0"
		transition:fade={{ duration: 200 }}
	>
		<div class="fixed inset-0 bg-black/50"></div>
		<div
			class="relative z-50 w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl transition-colors duration-200 dark:bg-gray-800"
			transition:scale={{ duration: 200, start: 0.95 }}
		>
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
				<button
					on:click={close}
					class="rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
					title="Close modal"
				>
					<X class="h-5 w-5" />
				</button>
			</div>
			<div class="overflow-y-auto">
				<slot />
			</div>
		</div>
	</div>
{/if}
