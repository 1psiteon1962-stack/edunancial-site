// lib/discipline-store.ts

import { DisciplineEntry } from "./core";

const KEY = "edunancial_discipline_log";

export function getDisciplineLog(): DisciplineEntry[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

export function addDisciplineEntry(entry: DisciplineEntry) {
  const log = getDisciplineLog();
  log.push(entry);
  localStorage.setItem(KEY, JSON.stringify(log));
}
