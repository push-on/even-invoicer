<script lang="ts">
	import type { InvoiceData } from '$lib/types';
	import { jsPDF } from 'jspdf';
	import html2canvas from 'html2canvas';
	import toast from 'svelte-french-toast';
	import { Download, FileText, Calendar, Mail, Building2, User, DollarSign } from 'lucide-svelte';

	export let invoiceData: InvoiceData;
	let isGenerating = false;
	let error: string | null = null;

	async function generatePDF() {
		isGenerating = true;
		error = null;
		const element = document.getElementById('invoice-pdf');

		if (!element) {
			error = 'PDF content not found';
			toast.error(error);
			isGenerating = false;
			return;
		}

		try {
			const isDark = document.documentElement.classList.contains('dark');
			if (isDark) {
				document.documentElement.classList.remove('dark');
			}

			const canvas = await html2canvas(element, { scale: 2 });

			if (isDark) {
				document.documentElement.classList.add('dark');
			}

			const pdf = new jsPDF({
				unit: 'px',
				format: 'letter',
				orientation: 'portrait'
			});

			const imgData = canvas.toDataURL('image/png');
			const imgProps = pdf.getImageProperties(imgData);
			const pdfWidth = pdf.internal.pageSize.getWidth();
			const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

			pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
			pdf.save(`Invoice_${invoiceData.invoiceNumber}.pdf`);
			toast.success('PDF generated successfully!');
		} catch (err: unknown) {
			error = err instanceof Error ? err.message : 'Failed to generate PDF';
			toast.error(error);
		} finally {
			isGenerating = false;
		}
	}
</script>

<div class="mb-4 flex items-center justify-between">
	<div class="flex items-center gap-2">
		<FileText class="h-6 w-6 text-blue-400" />
		<h2 class="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">
			Invoice Preview
		</h2>
	</div>
	<div>
		<button
			on:click={generatePDF}
			disabled={isGenerating}
			class="inline-flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 font-bold text-white transition-all duration-200 hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-blue-500"
		>
			{#if isGenerating}
				<div
					class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
				></div>
				<span>Generating...</span>
			{:else}
				<Download class="h-4 w-4" />
				<span>Generate PDF</span>
			{/if}
		</button>
		{#if error}
			<p class="mt-2 text-sm text-red-600">{error}</p>
		{/if}
	</div>
</div>

<div id="invoice-pdf" class="mx-auto max-w-4xl bg-white">
	<div class="flex items-stretch bg-gray-900">
		<div class="flex-1 px-8 py-12">
			<h2 class="text-4xl  text-white">INVOICE</h2>
		</div>
		<div class="bg-gray-800 px-16 py-12">
			<div class="text-sm text-gray-400">Amount Due (USD)</div>
			<div class="text-4xl font-semibold text-white">
				${invoiceData.timeEntries.reduce((sum, entry) => sum + entry.amount, 0).toFixed(2)}
			</div>
		</div>
	</div>

	<div class="p-8">
		<div class="mb-8 grid grid-cols-2">
			<div>
				<h3 class="text-lg text-gray-900">BILL TO</h3>
				<div class="mt-4 space-y-1">
					<p class="font-bold text-gray-900">{invoiceData.clientDetails.name}</p>
					<div class="whitespace-pre-line text-gray-700">
						{invoiceData.clientDetails.addressLine1}
						{#if invoiceData.clientDetails.addressLine2}
							<br />{invoiceData.clientDetails.addressLine2}
						{/if}
						<br />{invoiceData.clientDetails.city}, {invoiceData.clientDetails.state}
						{invoiceData.clientDetails.zipCode}
						<br />{invoiceData.clientDetails.country}
						{#if invoiceData.clientDetails.phone}
							<br /><br />{invoiceData.clientDetails.phone}
						{/if}
						<br />{invoiceData.clientDetails.email}
					</div>
				</div>
			</div>
			<div class="flex flex-col gap-2">
				<div class="flex text-lg text-gray-900">
					<span class="flex-1 text-right font-bold">Invoice Number</span>
					<span class="px-2">:</span>
					<span class="flex-1">{invoiceData.invoiceNumber.split('-')[1]}</span>
				</div>
				<div class="flex text-lg text-gray-700">
					<span class="flex-1 text-right font-bold">Invoice Date</span>
					<span class="px-2">:</span>
					<span class="flex-1"
						>{new Date(invoiceData.invoiceDate).toLocaleDateString('en-US', {
							month: 'long',
							day: 'numeric',
							year: 'numeric'
						})}</span
					>
				</div>
				<div class="flex text-lg text-gray-700">
					<span class="flex-1 text-right font-bold">Payment Due</span>
					<span class="px-2">:</span>
					<span class="flex-1"
						>{new Date(invoiceData.dueDate).toLocaleDateString('en-US', {
							month: 'long',
							day: 'numeric',
							year: 'numeric'
						})}</span
					>
				</div>
			</div>
		</div>

		<div class="mb-6">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th class="px-4 py-2 text-left text-sm font-medium uppercase text-gray-500">Items</th>
						<th class="px-4 py-2 text-right text-sm font-medium uppercase text-gray-500">Hours</th>
						<th class="px-4 py-2 text-right text-sm font-medium uppercase text-gray-500">Rate</th>
						<th class="px-4 py-2 text-right text-sm font-medium uppercase text-gray-500">Amount</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200">
					{#each invoiceData.timeEntries as entry}
						<tr>
							<td class="px-4 py-2 text-gray-900">
								<div>
									<div class="flex items-baseline gap-2">
										<span class="font-bold">{entry.clientFirstName} {entry.clientLastName}</span>
										<span class="text-gray-600">-</span>
										<span class="font-medium">{entry.item}</span>
									</div>
									{#if entry.notes}
										<div class="mt-1 text-sm text-gray-600">{entry.notes}</div>
									{/if}
								</div>
							</td>
							<td class="whitespace-nowrap px-4 py-2 text-right text-gray-900">
								{entry.hours.toFixed(2)}
							</td>
							<td class="whitespace-nowrap px-4 py-2 text-right text-gray-900">
								${entry.rate.toFixed(2)}/hr
							</td>
							<td class="whitespace-nowrap px-4 py-2 text-right text-gray-900">
								${entry.amount.toFixed(2)}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<div class="mt-8 border-t border-gray-200 pt-4">
			<div class="flex justify-end">
				<div class="w-64 space-y-3">
					<div class="flex justify-between py-2">
						<span class="font-semibold text-gray-900">Total:</span>
						<span class="font-bold text-gray-900">
							${invoiceData.timeEntries.reduce((sum, entry) => sum + entry.amount, 0).toFixed(2)}
						</span>
					</div>
					<div class="flex justify-between border-t border-gray-200 py-2">
						<span class="font-semibold text-gray-900">Amount Due (USD):</span>
						<span class="font-bold text-gray-900">
							${invoiceData.timeEntries.reduce((sum, entry) => sum + entry.amount, 0).toFixed(2)}
						</span>
					</div>
				</div>
			</div>
		</div>

		<div class="mt-24 border-t border-gray-200 pt-8">
			<div class="grid grid-cols-3 gap-8">
				<div class="flex items-center">
					<div class="text-2xl font-bold text-gray-900">Eveneer</div>
				</div>

				<div class="text-sm text-gray-600">
					<h4 class="mb-2 font-semibold text-gray-900">Business Address</h4>
					<p>Dhaka</p>
					<p>Bangladesh</p>
				</div>

				<div class="text-right text-sm text-gray-600">
					<h4 class="mb-2 font-semibold text-gray-900">Contact Information</h4>
					<p>Email: sales@eveneer.xyz</p>
					<p>Website: eveneer.xyz</p>
				</div>
			</div>
		</div>
	</div>
</div>
