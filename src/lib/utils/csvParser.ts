import type { TimeEntry } from '$lib/types'

function parseCSVLine(line: string): string[] {
	const values: string[] = []
	let currentValue = ''
	let insideQuotes = false

	for (let i = 0; i < line.length; i++) {
		const char = line[i]
		if (char === '"') {
			insideQuotes = !insideQuotes
		} else if (char === ',' && !insideQuotes) {
			values.push(currentValue.trim().replace(/^"|"$/g, ''))
			currentValue = ''
		} else {
			currentValue += char
		}
	}
	values.push(currentValue.trim().replace(/^"|"$/g, ''))
	return values
}

export function validateCSVFormat(csvText: string): boolean {
	const lines = csvText.split('\n')
	if (lines.length < 2) return false

	const header = lines[0].toLowerCase()
	const requiredColumns = [
		'date',
		'client',
		'project',
		'project code',
		'task',
		'notes',
		'hours',
		'billable?',
		'invoiced?',
		'approved?',
		'first name',
		'last name',
		'employee?',
		'external reference url'
	]

	return requiredColumns.every(col => header.includes(col.toLowerCase()))
}

interface CSVEntry {
	client: string
	project: string
	task: string
	notes: string
	hours: number
	rate: number
	billable: boolean
}

export function parseCSV(csvText: string): CSVEntry[] {
	if (!validateCSVFormat(csvText)) {
		throw new Error('Invalid CSV format. Please ensure all required columns are present.')
	}

	const lines = csvText.split('\n')
	const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase())
	lines.shift()

	return lines
		.filter(line => line.trim() !== '')
		.map(line => {
			const values = parseCSVLine(line)
			const entry: { [key: string]: any } = {}

			headers.forEach((header, index) => {
				const value = values[index] || ''
				switch (header) {
					case 'client':
						entry.client = value
						break
					case 'project':
						entry.project = value
						break
					case 'task':
						entry.task = value
						break
					case 'notes':
						entry.notes = value
						break
					case 'hours':
						entry.hours = parseFloat(value)
						break
					case 'rate':
						entry.rate = parseFloat(value)
						break
					case 'billable?':
						entry.billable = value.toLowerCase() === 'yes'
						break
				}
			})

			if (isNaN(entry.hours)) {
				throw new Error(`Invalid hours format in row: ${line}`)
			}

			if (isNaN(entry.rate)) {
				entry.rate = 0 // Default to 0 if rate is not found or invalid
			}

			return entry as CSVEntry
		})
		.filter(entry => entry.billable)
} 