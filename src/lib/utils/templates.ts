import type { InvoiceData } from '$lib/types'

const TEMPLATES_KEY = 'invoice_templates'

export interface Template {
	name: string
	data: InvoiceData
}

export function saveTemplate(name: string, data: InvoiceData): void {
	const templates = loadTemplates()
	templates[name] = {
		name,
		data: {
			...data,
			timeEntries: data.timeEntries.map(entry => ({
				...entry,
				invoiced: false 
			}))
		}
	}
	localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates))
}

export function loadTemplates(): Record<string, Template> {
	try {
		const data = localStorage.getItem(TEMPLATES_KEY)
		return data ? JSON.parse(data) : {}
	} catch {
		return {}
	}
} 