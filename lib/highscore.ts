export interface HighScoreEntry {
  name: string
  score: number
  level: number
  difficulty: string
  date: string
  mode?: "blitz" | "daily"
  challengeDate?: string | null
}

export const MAX_ENTRIES = 10

const VALID_DIFFICULTIES = new Set(["easy", "medium", "hard", "expert"])

export interface LeaderboardQuery {
  difficulty?: string
  mode?: "blitz" | "daily"
  challengeDate?: string
}

export function getBestScore(entries: HighScoreEntry[], difficulty?: string): number {
  const pool = difficulty
    ? entries.filter((e) => e.difficulty === difficulty)
    : entries
  return pool.reduce((best, e) => Math.max(best, e.score), 0)
}

export function qualifiesForLeaderboard(
  entries: HighScoreEntry[],
  score: number,
  difficulty?: string
): boolean {
  if (score <= 0) return false
  const pool = difficulty
    ? sortLeaderboard(entries.filter((e) => e.difficulty === difficulty))
    : sortLeaderboard(entries)
  if (pool.length < MAX_ENTRIES) return true
  const lowest = pool[pool.length - 1]?.score ?? 0
  return score > lowest
}

export function sortLeaderboard(entries: HighScoreEntry[]): HighScoreEntry[] {
  return [...entries].sort((a, b) => b.score - a.score).slice(0, MAX_ENTRIES)
}

export function filterLeaderboardByDifficulty(
  entries: HighScoreEntry[],
  difficulty: string
): HighScoreEntry[] {
  return sortLeaderboard(entries.filter((e) => e.difficulty === difficulty))
}

export function isValidDifficulty(value: string): boolean {
  return VALID_DIFFICULTIES.has(value)
}

function buildLeaderboardQuery(query: LeaderboardQuery = {}): string {
  const params = new URLSearchParams()
  if (query.difficulty) params.set("difficulty", query.difficulty)
  if (query.mode) params.set("mode", query.mode)
  if (query.challengeDate) params.set("date", query.challengeDate)
  const qs = params.toString()
  return qs ? `?${qs}` : ""
}

export async function fetchLeaderboard(
  difficultyOrQuery?: string | LeaderboardQuery
): Promise<HighScoreEntry[]> {
  const query: LeaderboardQuery =
    typeof difficultyOrQuery === "string"
      ? { difficulty: difficultyOrQuery, mode: "blitz" }
      : difficultyOrQuery
        ? { mode: "blitz", ...difficultyOrQuery }
        : { mode: "blitz" }

  const res = await fetch(`/api/leaderboard${buildLeaderboardQuery(query)}`, {
    cache: "no-store",
  })
  if (!res.ok) {
    throw new Error("Kunne ikke hente topplisten")
  }
  const data = (await res.json()) as { entries?: HighScoreEntry[] }
  return Array.isArray(data.entries) ? sortLeaderboard(data.entries) : []
}

export async function submitHighScore(
  entry: Omit<HighScoreEntry, "date"> & {
    mode?: "blitz" | "daily"
    challengeDate?: string | null
  }
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
