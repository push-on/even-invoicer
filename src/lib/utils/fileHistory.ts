interface FileHistoryEntry {
	name: string
	content: string
	lastUsed: number
}

const HISTORY_KEY = 'csv_file_history'
const MAX_HISTORY = 5

export async function addToHistory(file: File) {
	try {
		const content = await file.text()
		const base64Content = btoa(content)
		const history = getHistory()
		const newEntry: FileHistoryEntry = {
			name: file.name,
			content: base64Content,
			lastUsed: Date.now()
		}

		const filteredHistory = history.filter((entry) => entry.name !== newEntry.name)
		filteredHistory.unshift(newEntry)
		const trimmedHistory = filteredHistory.slice(0, MAX_HISTORY)
		localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory))
	} catch (error) {
		console.error('Failed to add file to history:', error)
	}
}

export function getHistory(): FileHistoryEntry[] {
	try {
		const history = localStorage.getItem(HISTORY_KEY)
		return history ? JSON.parse(history) : []
	} catch {
		return []
	}
}

export function removeFromHistory(name: string) {
	const history = getHistory()
	const filteredHistory = history.filter((entry) => entry.name !== name)
	localStorage.setItem(HISTORY_KEY, JSON.stringify(filteredHistory))
}

export function createFileFromHistory(entry: FileHistoryEntry): File {
	const content = atob(entry.content)
	return new File([content], entry.name, { type: 'text/csv' })
} 