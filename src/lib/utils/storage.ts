import type { InvoiceData } from '$lib/types'

const STORAGE_KEY = 'invoice_data'
const TEMPLATES_KEY = 'invoice_templates'

export interface Template {
	name: string
	data: Partial<InvoiceData>
}

export function saveInvoiceData(data: InvoiceData): void {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
	} catch (error) {
		console.error('Error saving invoice data:', error)
	}
}

export function loadInvoiceData(): InvoiceData | null {
	try {
		const data = localStorage.getItem(STORAGE_KEY)
		return data ? JSON.parse(data) : null
	} catch (error) {
		console.error('Error loading invoice data:', error)
		return null
	}
}

export function loadTemplates(): Record<string, Template> {
	try {
		const data = localStorage.getItem(TEMPLATES_KEY)
		return data ? JSON.parse(data) : {}
	} catch {
		return {}
	}
} 