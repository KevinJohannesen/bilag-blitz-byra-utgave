export interface HighScoreEntry {
  name: string
  score: number
  level: number
  difficulty: string
  date: string
}

const STORAGE_KEY = "bilag-blitz-leaderboard"
const LEGACY_KEY = "bilag-blitz-highscore"
export const MAX_ENTRIES = 10

function isEntry(value: unknown): value is HighScoreEntry {
  if (!value || typeof value !== "object") return false
  const e = value as HighScoreEntry
  return (
    typeof e.name === "string" &&
    typeof e.score === "number" &&
    typeof e.level === "number" &&
    typeof e.difficulty === "string" &&
    typeof e.date === "string"
  )
}

export function loadLeaderboard(): HighScoreEntry[] {
  if (typeof window === "undefined") return []

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as unknown
      if (Array.isArray(parsed)) {
        return parsed.filter(isEntry).sort((a, b) => b.score - a.score).slice(0, MAX_ENTRIES)
      }
    }

    // Migrer gammel enkelt-rekord
    const legacy = localStorage.getItem(LEGACY_KEY)
    if (legacy) {
      const score = parseInt(legacy, 10)
      if (!Number.isNaN(score) && score > 0) {
        const migrated: HighScoreEntry[] = [{
          name: "Anonym",
          score,
          level: Math.floor(score / 1000) + 1,
          difficulty: "medium",
          date: new Date().toISOString(),
        }]
        saveLeaderboard(migrated)
        return migrated
      }
    }
  } catch {
    return []
  }

  return []
}

export function saveLeaderboard(entries: HighScoreEntry[]): void {
  if (typeof window === "undefined") return
  const sorted = [...entries].sort((a, b) => b.score - a.score).slice(0, MAX_ENTRIES)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted))
  if (sorted[0]) {
    localStorage.setItem(LEGACY_KEY, String(sorted[0].score))
  }
}

export function getBestScore(entries: HighScoreEntry[], difficulty?: string): number {
  const pool = difficulty
    ? entries.filter(e => e.difficulty === difficulty)
    : entries
  return pool.reduce((best, e) => Math.max(best, e.score), 0)
}

export function qualifiesForLeaderboard(entries: HighScoreEntry[], score: number): boolean {
  if (score <= 0) return false
  if (entries.length < MAX_ENTRIES) return true
  const lowest = entries[entries.length - 1]?.score ?? 0
  return score > lowest
}

export function addHighScore(
  entries: HighScoreEntry[],
  entry: Omit<HighScoreEntry, "date">
): HighScoreEntry[] {
  const next: HighScoreEntry[] = [
    ...entries,
    { ...entry, date: new Date().toISOString() },
  ]
  const sorted = next.sort((a, b) => b.score - a.score).slice(0, MAX_ENTRIES)
  saveLeaderboard(sorted)
  return sorted
}
