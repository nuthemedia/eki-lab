import type { Interpretation } from "@/domain/iching/types";

/**
 * 保存済みの占い結果(localStorage、端末内のみ)。
 * useSyncExternalStore で読めるよう、購読可能な小さなストアにしている。
 */
export type SavedReading = {
  id: string;
  savedAt: string; // ISO
  rawInput: string;
  finalInquiry: string;
  mode: "formal" | "dice";
  primaryNumber: number;
  primaryName: string;
  changingLineIndexes: number[];
  relatingNumber: number | null;
  relatingName: string | null;
  interpretation: Interpretation;
  interpretationSource: "llm" | "fallback";
};

const STORAGE_KEY = "iching-readings-v1";
const MAX_SAVED = 50;
const EMPTY: SavedReading[] = [];

let cache: SavedReading[] | null = null;
const listeners = new Set<() => void>();

function readStorage(): SavedReading[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as SavedReading[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function commit(list: SavedReading[]): void {
  cache = list;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // 容量超過等は黙って無視(保存できないだけ)
  }
  listeners.forEach((listener) => listener());
}

export function subscribeReadings(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getReadingsSnapshot(): SavedReading[] {
  if (cache === null) cache = readStorage();
  return cache;
}

export function getServerReadingsSnapshot(): SavedReading[] {
  return EMPTY;
}

export function saveReading(
  reading: Omit<SavedReading, "id" | "savedAt">,
): SavedReading {
  const record: SavedReading = {
    ...reading,
    id: crypto.randomUUID(),
    savedAt: new Date().toISOString(),
  };
  commit([record, ...getReadingsSnapshot()].slice(0, MAX_SAVED));
  return record;
}

export function deleteReading(id: string): void {
  commit(getReadingsSnapshot().filter((r) => r.id !== id));
}
