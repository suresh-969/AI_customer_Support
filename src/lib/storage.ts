import type { Ticket } from '@/types';
import { sampleTickets } from '@/data/sampleTickets';

const STORAGE_KEY = 'triage-tickets-v1';

export function loadTickets(): Ticket[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return sampleTickets;
    const parsed = JSON.parse(raw) as Ticket[];
    if (!Array.isArray(parsed) || parsed.length === 0) return sampleTickets;
    return parsed;
  } catch {
    return sampleTickets;
  }
}

export function saveTickets(tickets: Ticket[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  } catch {
    // ignore
  }
}
