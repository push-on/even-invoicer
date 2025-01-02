<script lang="ts">
	import { Sun, Moon, FileText } from 'lucide-svelte';
	import { onMount } from 'svelte';

	let darkMode = false;
	let isDarkModeInitialized = false;

	onMount(() => {
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		const storedDarkMode = localStorage.getItem('darkMode');
		darkMode = storedDarkMode === null ? prefersDark : storedDarkMode === 'true';
		isDarkModeInitialized = true;
		updateTheme();

		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
			if (localStorage.getItem('darkMode') === null) {
				darkMode = e.matches;
				updateTheme();
			}
		});
	});

	function updateTheme() {
		if (darkMode) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
		localStorage.setItem('darkMode', darkMode.toString());
	}

	function toggleDarkMode() {
		darkMode = !darkMode;
		updateTheme();
	}

	function handleGitHubClick(event: MouseEvent) {
		if (!confirm('This link leads to a private repository. Do you want to continue?')) {
			event.preventDefault();
		}
	}
</script>

<div
	class="fixed left-0 right-0 top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md transition-colors duration-200 dark:border-gray-800 dark:bg-gray-900/80"
>
	<div class="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center justify-between">
			<div class="flex items-center gap-2">
				<FileText class="h-6 w-6 text-blue-500 dark:text-blue-400" />
				<h1 class="text-xl font-bold text-gray-900 dark:text-white md:text-2xl">CSV to Invoice</h1>
			</div>
			<div class="flex items-center gap-4">
				<a
					href="https://github.com/push-on/even-invoicer"
					on:click={handleGitHubClick}
					target="_blank"
					rel="noopener noreferrer"
					class="hidden items-center gap-2 text-sm text-gray-600 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 sm:flex"
				>
					View on GitHub
				</a>
				{#if isDarkModeInitialized}
					<button
						on:click={toggleDarkMode}
						class="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
						aria-label="Toggle dark mode"
					>
						{#if darkMode}
							<Sun class="h-5 w-5" />
						{:else}
							<Moon class="h-5 w-5" />
						{/if}
					</button>
				{/if}
			</div>
		</div>
	</div>
</div>
