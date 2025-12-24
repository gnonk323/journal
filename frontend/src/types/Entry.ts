export interface ICreateEntry {
  content: string
  tags: string[]
}

// ---

export interface IJournalEntry {
  _id: string
  content: string
  tags: string[]
  createdAt: string // ISO Date string
  updatedAt: string // ISO Date string
  dateStr?: string
}

export interface IJournalEntriesByDayResponse {
  date: string // YYYY-MM-DD
  timezone: string
  range: {
    start: string // ISO Date string
    end: string   // ISO Date string
  }
  count: number
  entries: IJournalEntry[]
}

// ---

export interface IJournalEntriesResponse {
  month: number
  year: number
  timezone: string
  days: {
    count: number
    date: string // YYYY-MM-DD
  }[]
}
