export interface FeilbokEntry {
  description: string
  yourAnswer?: string
  correctAccount: string
  accountName: string
  explain?: string
  reason: "wrong" | "miss"
}

const STORAGE_KEY = "bilag-blitz-feilbok"

export function loadFeilbok(): FeilbokEntry[] {
  if (typeof window === "undefined") return []
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isFeilbokEntry)
  } catch {
    return []
  }
}

export function saveFeilbok(entries: FeilbokEntry[]): void {
  if (typeof window === "undefined") return
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, 40)))
  } catch {
    // ignore quota / private mode
  }
}

export function clearFeilbok(): void {
  if (typeof window === "undefined") return
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

function isFeilbokEntry(value: unknown): value is FeilbokEntry {
  if (!value || typeof value !== "object") return false
  const v = value as FeilbokEntry
  return (
    typeof v.description === "string" &&
    typeof v.correctAccount === "string" &&
    typeof v.accountName === "string" &&
    (v.reason === "wrong" || v.reason === "miss")
  )
}
