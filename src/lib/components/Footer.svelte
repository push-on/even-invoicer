<script lang="ts">
	import { Github } from 'lucide-svelte';

	const AUTHOR_NAME = 'Imran Hossain';

	function handleGitHubClick(event: MouseEvent) {
		if (!confirm('This link leads to a private repository. Do you want to continue?')) {
			event.preventDefault();
		}
	}
</script>

<footer class="mt-8 border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
	<div class="mx-auto max-w-[1920px] px-4 py-8 text-center sm:px-6 lg:px-8">
		<p class="text-gray-600 dark:text-gray-400">
			CSV to Invoice is a tool for generating professional invoices.
		</p>
		<div
			class="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400"
		>
			<span>Created by {AUTHOR_NAME}</span>
			<span>•</span>
			<a
				href="https://github.com/push-on/even-invoicer"
				on:click={handleGitHubClick}
				target="_blank"
				rel="noopener noreferrer"
				class="flex items-center gap-1 hover:text-blue-500 dark:hover:text-blue-400"
			>
				<Github class="h-4 w-4" />
				GitHub
			</a>
		</div>
	</div>
</footer>
