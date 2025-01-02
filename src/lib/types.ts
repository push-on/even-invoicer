export interface TimeEntry {
	item: string
	clientFirstName: string
	clientLastName: string
	notes: string
	hours: number
	rate: number
	amount: number
}

export interface ClientDetails {
	name: string
	firstName: string
	lastName: string
	addressLine1: string
	addressLine2: string
	city: string
	state: string
	zipCode: string
	country: string
	phone: string
	email: string
}

export interface InvoiceData {
	clientDetails: ClientDetails
	invoiceNumber: string
	invoiceDate: string
	dueDate: string
	defaultRate: number
	timeEntries: TimeEntry[]
} 