export interface HighScoreEntry {
  name: string
  score: number
  level: number
  difficulty: string
  date: string
}

export const MAX_ENTRIES = 10

const VALID_DIFFICULTIES = new Set(["easy", "medium", "hard", "expert"])

export function getBestScore(entries: HighScoreEntry[], difficulty?: string): number {
  const pool = difficulty
    ? entries.filter((e) => e.difficulty === difficulty)
    : entries
  return pool.reduce((best, e) => Math.max(best, e.score), 0)
}

export function qualifiesForLeaderboard(entries: HighScoreEntry[], score: number): boolean {
  if (score <= 0) return false
  if (entries.length < MAX_ENTRIES) return true
  const lowest = entries[entries.length - 1]?.score ?? 0
  return score > lowest
}

export function sortLeaderboard(entries: HighScoreEntry[]): HighScoreEntry[] {
  return [...entries].sort((a, b) => b.score - a.score).slice(0, MAX_ENTRIES)
}

export function isValidDifficulty(value: string): boolean {
  return VALID_DIFFICULTIES.has(value)
}

export async function fetchLeaderboard(): Promise<HighScoreEntry[]> {
  const res = await fetch("/api/leaderboard", { cache: "no-store" })
  if (!res.ok) {
    throw new Error("Kunne ikke hente topplisten")
  }
  const data = (await res.json()) as { entries?: HighScoreEntry[] }
  return Array.isArray(data.entries) ? sortLeaderboard(data.entries) : []
}

export async function submitHighScore(
  entry: Omit<HighScoreEntry, "date">
): Promise<HighScoreEntry[]> {
  const res = await fetch("/api/leaderboard", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry),
  })

  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as { error?: string } | null
    throw new Error(data?.error ?? "Kunne ikke lagre rekorden")
  }

  const data = (await res.json()) as { entries?: HighScoreEntry[] }
  return Array.isArray(data.entries) ? sortLeaderboard(data.entries) : []
}
