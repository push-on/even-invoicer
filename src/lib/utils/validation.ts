import type { InvoiceData } from '$lib/types'

export function validateInvoiceData(data: InvoiceData, selectedClient: string | null = null): { [key: string]: string } {
	const errors: { [key: string]: string } = {}

	// Client name validation
	if (!data.clientDetails.name) {
		errors.clientName = 'Client name is required'
	} else if (selectedClient && data.clientDetails.name !== selectedClient) {
		errors.clientName = 'Client name must match selected client'
	}

	// Client address validation
	if (!data.clientDetails.address) {
		errors.clientAddress = 'Client address is required'
	}

	// Client email validation
	if (!data.clientDetails.email) {
		errors.clientEmail = 'Client email is required'
	} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.clientDetails.email)) {
		errors.clientEmail = 'Invalid email format'
	}

	// Invoice number validation
	if (!data.invoiceNumber) {
		errors.invoiceNumber = 'Invoice number is required'
	}

	// Invoice date validation
	if (!data.invoiceDate) {
		errors.invoiceDate = 'Invoice date is required'
	}

	// Due date validation
	if (!data.dueDate) {
		errors.dueDate = 'Due date is required'
	} else if (new Date(data.dueDate) < new Date(data.invoiceDate)) {
		errors.dueDate = 'Due date must be after invoice date'
	}

	// Default rate validation
	if (data.defaultRate <= 0) {
		errors.defaultRate = 'Default rate must be greater than 0'
	}

	// Time entries validation
	if (!data.timeEntries.length) {
		errors.timeEntries = 'At least one time entry is required'
	}

	return errors
} 