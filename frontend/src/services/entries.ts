import { IJournalEntriesByDayResponse, IJournalEntriesResponse } from './../types/Entry';
import { api } from "./api"
import { ICreateEntry } from "../types/Entry"

const TZ = Intl.DateTimeFormat().resolvedOptions().timeZone

export async function createEntryService(entry: ICreateEntry) {
  const response = await api.post('/api/entries', {
    content: entry.content,
    tags: entry.tags,
  })
  return response.data
}

export async function getTodayEntriesService(): Promise<IJournalEntriesByDayResponse> {
  const date = new Date().toLocaleDateString('en-CA')

  const response = await api.get<IJournalEntriesByDayResponse>(`/api/entries/day?date=${date}&timezone=${TZ}`)
  return response.data
}

export async function deleteEntryService(id: string) {
  const response = await api.delete(`/api/entries/${id}`)
  return response.data
}

export async function getMonthEntriesService(month?: number, year?: number): Promise<IJournalEntriesResponse> {
  const response = await api.get<IJournalEntriesResponse>(`/api/entries?timezone=${TZ}&month=${month}&year=${year}`)
  return response.data
}

export async function getEntriesByDateService(dateStr: string): Promise<IJournalEntriesByDayResponse> {
  const response = await api.get<IJournalEntriesByDayResponse>(`/api/entries/day?date=${dateStr}&timezone=${TZ}`)
  return response.data
}