<script lang="ts">
	import type { InvoiceData } from '$lib/types';
	import {
		FileText,
		DollarSign,
		Calendar,
		Mail,
		Building2,
		User,
		Save,
		Phone
	} from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';

	export let invoiceData: InvoiceData;
	export let formErrors: { [key: string]: string } = {};
	export let selectedClient: string | null = '';

	type ClientField = keyof typeof invoiceData.clientDetails;
	type InvoiceField = 'invoiceNumber' | 'invoiceDate' | 'dueDate' | 'defaultRate';
	type UpdateEvent = {
		field: ClientField | InvoiceField;
		value: string | number;
	};

	const dispatch = createEventDispatcher<{
		saveTemplate: void;
		openTemplates: void;
		update: UpdateEvent;
	}>();

	function handleSaveTemplate() {
		dispatch('saveTemplate');
	}

	function handleOpenTemplates() {
		dispatch('openTemplates');
	}

	function handleFieldUpdate(field: ClientField | InvoiceField, value: string | number) {
		dispatch('update', { field, value });
	}
</script>

<section
	class="rounded-lg bg-gray-50 p-6 shadow-sm transition-colors duration-200 dark:bg-gray-800 {!selectedClient
		? 'hidden'
		: ''}"
>
	<div class="mb-6 flex items-center justify-between">
		<h2 class="text-xl font-semibold text-gray-900 dark:text-white">Invoice Details</h2>
		<div class="flex gap-2">
			<button
				on:click={handleSaveTemplate}
				class="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
			>
				<Save class="h-4 w-4" />
				Save as Template
			</button>
			<button
				on:click={handleOpenTemplates}
				class="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
			>
				<FileText class="h-4 w-4" />
				View Saved Templates
			</button>
		</div>
	</div>

	<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
		<div class="space-y-4">
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white">BILL TO</h3>

			<div class="grid grid-cols-2 gap-4">
				<div>
					<label
						for="invoice-client-firstname"
						class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
					>
						<User class="h-4 w-4" />
						First Name
					</label>
					<input
						type="text"
						id="invoice-client-firstname"
						value={invoiceData.clientDetails.firstName}
						on:input={(e) => {
							handleFieldUpdate('firstName', e.currentTarget.value);
							handleFieldUpdate(
								'name',
								`${e.currentTarget.value} ${invoiceData.clientDetails.lastName}`.trim()
							);
						}}
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
					/>
				</div>
				<div>
					<label
						for="invoice-client-lastname"
						class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
					>
						<User class="h-4 w-4" />
						Last Name
					</label>
					<input
						type="text"
						id="invoice-client-lastname"
						value={invoiceData.clientDetails.lastName}
						on:input={(e) => {
							handleFieldUpdate('lastName', e.currentTarget.value);
							handleFieldUpdate(
								'name',
								`${invoiceData.clientDetails.firstName} ${e.currentTarget.value}`.trim()
							);
						}}
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
					/>
				</div>
			</div>

			<div>
				<label
					for="invoice-client-address1"
					class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
				>
					<Building2 class="h-4 w-4" />
					Address Line 1
				</label>
				<input
					type="text"
					id="invoice-client-address1"
					value={invoiceData.clientDetails.addressLine1}
					on:input={(e) => handleFieldUpdate('addressLine1', e.currentTarget.value)}
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
				/>
			</div>

			<div>
				<label
					for="invoice-client-address2"
					class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
				>
					<Building2 class="h-4 w-4" />
					Address Line 2
				</label>
				<input
					type="text"
					id="invoice-client-address2"
					value={invoiceData.clientDetails.addressLine2}
					on:input={(e) => handleFieldUpdate('addressLine2', e.currentTarget.value)}
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
				/>
			</div>

			<div class="grid grid-cols-3 gap-4">
				<div>
					<label
						for="invoice-client-city"
						class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
					>
						City
					</label>
					<input
						type="text"
						id="invoice-client-city"
						value={invoiceData.clientDetails.city}
						on:input={(e) => handleFieldUpdate('city', e.currentTarget.value)}
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
					/>
				</div>
				<div>
					<label
						for="invoice-client-state"
						class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
					>
						State
					</label>
					<input
						type="text"
						id="invoice-client-state"
						value={invoiceData.clientDetails.state}
						on:input={(e) => handleFieldUpdate('state', e.currentTarget.value)}
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
					/>
				</div>
				<div>
					<label
						for="invoice-client-zipcode"
						class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
					>
						ZIP Code
					</label>
					<input
						type="text"
						id="invoice-client-zipcode"
						value={invoiceData.clientDetails.zipCode}
						on:input={(e) => handleFieldUpdate('zipCode', e.currentTarget.value)}
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
					/>
				</div>
			</div>

			<div>
				<label
					for="invoice-client-country"
					class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
				>
					<Building2 class="h-4 w-4" />
					Country
				</label>
				<input
					type="text"
					id="invoice-client-country"
					value={invoiceData.clientDetails.country}
					on:input={(e) => handleFieldUpdate('country', e.currentTarget.value)}
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
				/>
			</div>

			<div>
				<label
					for="invoice-client-phone"
					class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
				>
					<Phone class="h-4 w-4" />
					Phone Number
				</label>
				<input
					type="tel"
					id="invoice-client-phone"
					value={invoiceData.clientDetails.phone}
					placeholder="+1234567890"
					on:input={(e) => handleFieldUpdate('phone', e.currentTarget.value)}
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
				/>
			</div>

			<div>
				<label
					for="invoice-client-email"
					class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
				>
					<Mail class="h-4 w-4" />
					Email
				</label>
				<input
					type="email"
					id="invoice-client-email"
					value={invoiceData.clientDetails.email}
					placeholder="client@email.com"
					on:input={(e) => handleFieldUpdate('email', e.currentTarget.value)}
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white {formErrors.clientEmail
						? 'border-red-500'
						: ''}"
				/>
				{#if formErrors.clientEmail}
					<p class="mt-1 text-sm text-red-600 dark:text-red-400">
						{formErrors.clientEmail}
					</p>
				{/if}
			</div>
		</div>

		<div class="space-y-4">
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white">INVOICE DETAILS</h3>
			<div>
				<label
					for="invoice-number"
					class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
				>
					<FileText class="h-4 w-4" />
					Invoice Number
				</label>
				<input
					type="text"
					id="invoice-number"
					value={invoiceData.invoiceNumber}
					on:input={(e) => handleFieldUpdate('invoiceNumber', e.currentTarget.value)}
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white {formErrors.invoiceNumber
						? 'border-red-500'
						: ''}"
				/>
				{#if formErrors.invoiceNumber}
					<p class="mt-1 text-sm text-red-600 dark:text-red-400">
						{formErrors.invoiceNumber}
					</p>
				{/if}
			</div>
			<div>
				<label
					for="invoice-date"
					class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
				>
					<Calendar class="h-4 w-4" />
					Invoice Date
				</label>
				<input
					type="date"
					id="invoice-date"
					value={invoiceData.invoiceDate}
					on:input={(e) => handleFieldUpdate('invoiceDate', e.currentTarget.value)}
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white {formErrors.invoiceDate
						? 'border-red-500'
						: ''}"
				/>
				{#if formErrors.invoiceDate}
					<p class="mt-1 text-sm text-red-600 dark:text-red-400">
						{formErrors.invoiceDate}
					</p>
				{/if}
			</div>
			<div>
				<label
					for="invoice-due-date"
					class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
				>
					<Calendar class="h-4 w-4" />
					Due Date
				</label>
				<input
					type="date"
					id="invoice-due-date"
					value={invoiceData.dueDate}
					on:input={(e) => handleFieldUpdate('dueDate', e.currentTarget.value)}
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white {formErrors.dueDate
						? 'border-red-500'
						: ''}"
				/>
				{#if formErrors.dueDate}
					<p class="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.dueDate}</p>
				{/if}
			</div>
			<div>
				<label
					for="invoice-default-rate"
					class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
				>
					<DollarSign class="h-4 w-4" />
					Default Rate (USD)
				</label>
				<input
					type="number"
					id="invoice-default-rate"
					value={invoiceData.defaultRate}
					on:input={(e) => handleFieldUpdate('defaultRate', parseFloat(e.currentTarget.value))}
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white {formErrors.defaultRate
						? 'border-red-500'
						: ''}"
				/>
				<div class="mt-2 flex flex-wrap gap-2">
					{#each [50, 75, 100, 125, 150, 200] as rate}
						<button
							on:click={() => handleFieldUpdate('defaultRate', rate)}
							class="rounded-md bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
						>
							${rate}
						</button>
					{/each}
				</div>
				{#if formErrors.defaultRate}
					<p class="mt-1 text-sm text-red-600 dark:text-red-400">
						{formErrors.defaultRate}
					</p>
				{/if}
			</div>
		</div>
	</div>
</section>
