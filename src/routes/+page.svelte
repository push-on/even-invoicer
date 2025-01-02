<script lang="ts">
	import type { InvoiceData } from '$lib/types';
	import { parseCSV } from '$lib/utils/csvParser';
	import InvoicePDF from '$lib/components/InvoicePDF.svelte';
	import { onMount } from 'svelte';
	import { saveInvoiceData, loadInvoiceData, loadTemplates } from '$lib/utils/storage';
	import { validateInvoiceData } from '$lib/utils/validation';
	import { saveTemplate } from '$lib/utils/templates';
	import toast, { Toaster } from 'svelte-french-toast';
	import { FileText, AlertTriangle, Save, CheckCircle } from 'lucide-svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import FileUpload from '$lib/components/FileUpload.svelte';
	import FileHistory from '$lib/components/FileHistory.svelte';
	import { addToHistory, createFileFromHistory } from '$lib/utils/fileHistory';

	import TemplatesList from '$lib/components/TemplatesList.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import type { Template } from '$lib/utils/storage';
	import ClientSelect from '$lib/components/ClientSelect.svelte';
	import InvoiceDetailsForm from '$lib/components/InvoiceDetailsForm.svelte';
	import TimeEntryForm from '$lib/components/TimeEntryForm.svelte';

	let csvFile: File | null = null;
	let selectedClient: string | null = '';
	let parsedClients: string[] = [];

	let invoiceData: InvoiceData = {
		clientDetails: {
			name: '',
			firstName: '',
			lastName: '',
			addressLine1: '',
			addressLine2: '',
			city: '',
			state: '',
			zipCode: '',
			country: 'United States',
			phone: '',
			email: ''
		},
		invoiceNumber: '',
		invoiceDate: new Date().toISOString().split('T')[0],
		dueDate: '',
		defaultRate: 0,
		timeEntries: []
	};

	let csvError: string | null = null;
	let formErrors: { [key: string]: string } = {};
	let isDirty = false;

	let isTemplatesModalOpen = false;
	let isLoadingFile = false;

	function handleLoadTemplate(event: CustomEvent<{ clientName: string; template: Template }>) {
		const { clientName, template } = event.detail;
		const defaultClientDetails = {
			name: clientName,
			firstName: '',
			lastName: '',
			addressLine1: '',
			addressLine2: '',
			city: '',
			state: '',
			zipCode: '',
			country: 'United States',
			phone: '',
			email: ''
		};

		invoiceData = {
			clientDetails: template.data.clientDetails ?? defaultClientDetails,
			invoiceNumber: template.data.invoiceNumber || '',
			invoiceDate: template.data.invoiceDate || '',
			dueDate: template.data.dueDate || '',
			defaultRate: template.data.defaultRate || 0,
			timeEntries: template.data.timeEntries || []
		};
		selectedClient = clientName;
		isTemplatesModalOpen = false;
	}

	async function handleFileUpload(event: CustomEvent<{ file: File }>) {
		try {
			csvFile = event.detail.file;
			const text = await csvFile.text();
			const csvData = parseCSV(text);
			parsedClients = [...new Set(csvData.map((entry) => entry.client))];

			// Convert CSV entries to TimeEntry format
			const timeEntries = csvData.map((entry) => {
				const [firstName, ...lastNameParts] = entry.client.split(' ');
				return {
					item: entry.project,
					clientFirstName: firstName || '',
					clientLastName: lastNameParts.join(' ') || '',
					notes: entry.notes || '',
					hours: entry.hours,
					rate: 0, // Initialize rate to 0, will be set manually
					amount: 0 // Will be calculated when rate is set
				};
			});

			invoiceData.timeEntries = timeEntries;

			if (parsedClients.length === 1) {
				selectedClient = parsedClients[0];
				filterEntriesByClient();
			}

			await addToHistory(csvFile);

			toast.success('Time report uploaded successfully!', {
				icon: CheckCircle
			});
			csvError = null;
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
			toast.error(errorMessage, {
				icon: AlertTriangle
			});
			csvError = errorMessage;
			parsedClients = [];
			invoiceData.timeEntries = [];
		}
	}

	function handleFileReset() {
		csvFile = null;
		selectedClient = '';
		parsedClients = [];
		invoiceData.timeEntries = [];
		const input = document.getElementById('file-upload') as HTMLInputElement;
		if (input) input.value = '';
	}

	function filterEntriesByClient() {
		if (selectedClient) {
			const template = loadTemplates()[selectedClient];
			if (template) {
				invoiceData.clientDetails = template.data.clientDetails ?? invoiceData.clientDetails;
				invoiceData.defaultRate = template.data.defaultRate ?? invoiceData.defaultRate;
				invoiceData.timeEntries = template.data.timeEntries ?? [];
			} else {
				const [firstName, ...lastNameParts] = selectedClient.split(' ');
				const lastName = lastNameParts.join(' ');

				invoiceData.clientDetails = {
					name: selectedClient,
					firstName: firstName || '',
					lastName: lastName || '',
					addressLine1: '123 Business Street',
					addressLine2: 'Suite 100',
					city: 'Anchorage',
					state: 'Alaska',
					zipCode: '99501',
					country: 'United States',
					phone: '+1234567890',
					email: `billing@${selectedClient.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`
				};

				// Filter time entries for selected client
				const [selectedFirstName, ...selectedLastNameParts] = selectedClient.split(' ');
				const selectedLastName = selectedLastNameParts.join(' ');
				invoiceData.timeEntries = invoiceData.timeEntries.filter(
					(entry) =>
						entry.clientFirstName === selectedFirstName && entry.clientLastName === selectedLastName
				);

				// If no entries found, create a default one
				if (invoiceData.timeEntries.length === 0) {
					invoiceData.timeEntries = [
						{
							item: 'Professional Services',
							clientFirstName: firstName || '',
							clientLastName: lastName || '',
							notes: 'Initial consultation and project setup',
							hours: 0,
							rate: invoiceData.defaultRate,
							amount: 0
						}
					];
				}
			}

			if (!invoiceData.invoiceDate) {
				invoiceData.invoiceDate = new Date().toISOString().split('T')[0];
			}

			if (!invoiceData.dueDate) {
				const dueDate = new Date(invoiceData.invoiceDate);
				dueDate.setDate(dueDate.getDate() + 30);
				invoiceData.dueDate = dueDate.toISOString().split('T')[0];
			}

			if (!invoiceData.invoiceNumber) {
				const today = new Date();
				const year = today.getFullYear();
				const month = String(today.getMonth() + 1).padStart(2, '0');
				const randomNum = Math.floor(Math.random() * 1000)
					.toString()
					.padStart(3, '0');
				invoiceData.invoiceNumber = `INV-${year}${month}-${randomNum}`;
			}
		}
	}

	$: uniqueClients = parsedClients;

	function validateForm(): boolean {
		formErrors = validateInvoiceData(invoiceData, selectedClient);
		return Object.keys(formErrors).length === 0;
	}

	$: {
		if (isDirty) {
			validateForm();
			saveInvoiceData(invoiceData);
		}
	}

	$: {
		if (invoiceData.defaultRate) {
			invoiceData.timeEntries = invoiceData.timeEntries.map((entry) => {
				if (entry.rate === 0) {
					return {
						...entry,
						rate: invoiceData.defaultRate,
						amount: entry.hours * invoiceData.defaultRate
					};
				}
				return entry;
			});
		}
	}

	function handleInvoiceDetailsUpdate(
		event: CustomEvent<{
			field: keyof InvoiceData | keyof typeof invoiceData.clientDetails;
			value: any;
		}>
	) {
		const { field, value } = event.detail;
		if (field in invoiceData.clientDetails) {
			invoiceData.clientDetails[field as keyof typeof invoiceData.clientDetails] = value;
		} else {
			// @ts-ignore
			invoiceData[field as keyof InvoiceData] = value;
		}
		isDirty = true;
	}

	onMount(() => {
		const savedData = loadInvoiceData();
		if (savedData) {
			invoiceData = savedData;
		}
	});

	function saveCurrentTemplate() {
		if (selectedClient && validateForm()) {
			saveTemplate(selectedClient, invoiceData);
			toast.success(`Template saved for ${selectedClient}`, {
				icon: CheckCircle
			});
		} else {
			toast.error('Please fill in all required fields before saving the template.', {
				icon: AlertTriangle
			});
		}
	}
</script>

<Toaster
	position="top-center"
	toastOptions={{
		duration: 5000,
		style: 'border-radius: 10px; background: #333; color: #fff;'
	}}
/>

<main
	class="flex min-h-screen flex-col bg-gray-100 transition-colors duration-200 dark:bg-gray-950"
>
	<Header />

	<div class="flex-1 overflow-hidden">
		<div class="mx-auto h-full max-w-[1920px] overflow-y-auto px-4 pt-28 sm:px-6 lg:px-8">
			<div class="grid h-full grid-cols-1 gap-8 xl:grid-cols-2">
				<div class="{!csvFile ? 'xl:col-span-2' : ''} space-y-8">
					<FileUpload
						{csvFile}
						{csvError}
						on:upload={handleFileUpload}
						on:reset={handleFileReset}
					/>

					{#if !csvFile}
						<FileHistory
							on:select={async (e) => {
								try {
									isLoadingFile = true;
									toast.loading('Opening file...', { id: 'fileLoad' });

									const file = createFileFromHistory(e.detail.entry);
									handleFileUpload(new CustomEvent('upload', { detail: { file } }));
									toast.dismiss('fileLoad');
								} catch (error) {
									toast.error('Could not load the file. It may have been corrupted.', {
										id: 'fileLoad',
										icon: AlertTriangle
									});
								} finally {
									isLoadingFile = false;
								}
							}}
						/>
					{/if}

					{#if uniqueClients.length > 1}
						<ClientSelect
							clients={uniqueClients}
							{selectedClient}
							onClientChange={(client) => {
								selectedClient = client;
								filterEntriesByClient();
							}}
						/>
					{/if}

					<InvoiceDetailsForm
						{invoiceData}
						{formErrors}
						{selectedClient}
						on:saveTemplate={saveCurrentTemplate}
						on:openTemplates={() => (isTemplatesModalOpen = true)}
						on:update={(e) => {
							const { field, value } = e.detail;
							if (
								field === 'name' ||
								field === 'firstName' ||
								field === 'lastName' ||
								field === 'addressLine1' ||
								field === 'addressLine2' ||
								field === 'city' ||
								field === 'state' ||
								field === 'zipCode' ||
								field === 'country' ||
								field === 'phone' ||
								field === 'email'
							) {
								invoiceData.clientDetails[field] = value as string;
							} else if (field === 'defaultRate') {
								invoiceData[field] = value as number;
							} else if (
								field === 'invoiceNumber' ||
								field === 'invoiceDate' ||
								field === 'dueDate'
							) {
								invoiceData[field] = value as string;
							}
							isDirty = true;
						}}
					/>

					{#if selectedClient}
						<TimeEntryForm
							entries={invoiceData.timeEntries}
							defaultRate={invoiceData.defaultRate}
							on:update={(e) => {
								invoiceData.timeEntries = e.detail.entries;
							}}
						/>
					{/if}
				</div>

				{#if csvFile}
					<div class="xl:block">
						<div class="h-fit rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
							{#if selectedClient}
								<InvoicePDF {invoiceData} />
							{:else}
								<div
									class="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
								>
									<p class="text-center text-gray-500 dark:text-gray-400">
										Please select a client to preview the invoice
									</p>
								</div>
							{/if}
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<Modal
		title="Saved Templates"
		bind:isOpen={isTemplatesModalOpen}
		on:close={() => (isTemplatesModalOpen = false)}
	>
		<TemplatesList on:loadTemplate={handleLoadTemplate} />
	</Modal>

	<Footer />
</main>

<style>
	:global(html) {
		@apply antialiased;
	}

	:global(body) {
		@apply bg-gray-100 dark:bg-gray-950;
	}
</style>
