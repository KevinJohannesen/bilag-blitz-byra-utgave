import { isValidDifficulty } from "@/lib/highscore"
import { isValidChallengeDate } from "@/lib/daily-challenge"

export type LeaderboardMode = "blitz" | "daily"

export type ParsedSubmitBody =
  | {
      ok: true
      name: string
      score: number
      level: number
      difficulty: string
      mode: LeaderboardMode
      challengeDate: string | null
    }
  | { ok: false; error: string }

export function isValidLeaderboardMode(value: string): value is LeaderboardMode {
  return value === "blitz" || value === "daily"
}

export function parseSubmitBody(body: unknown): ParsedSubmitBody {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Ugyldig forespørsel" }
  }

  const raw = body as {
    name?: unknown
    score?: unknown
    level?: unknown
    difficulty?: unknown
    mode?: unknown
    challengeDate?: unknown
  }

  const name =
    typeof raw.name === "string" ? raw.name.trim().slice(0, 16) || "Anonym" : "Anonym"
  const score = typeof raw.score === "number" ? Math.floor(raw.score) : NaN
  const level = typeof raw.level === "number" ? Math.floor(raw.level) : NaN
  const difficulty = typeof raw.difficulty === "string" ? raw.difficulty : ""
  const modeRaw = typeof raw.mode === "string" ? raw.mode : "blitz"
  const challengeDateRaw =
    typeof raw.challengeDate === "string" ? raw.challengeDate.trim() : null

  if (!Number.isFinite(score) || score <= 0 || score > 1_000_000) {
    return { ok: false, error: "Ugyldig poengsum" }
  }
  if (!Number.isFinite(level) || level < 1 || level > 10_000) {
    return { ok: false, error: "Ugyldig nivå" }
  }
  if (!isValidDifficulty(difficulty)) {
    return { ok: false, error: "Ugyldig vanskelighetsgrad" }
  }
  if (!isValidLeaderboardMode(modeRaw)) {
    return { ok: false, error: "Ugyldig spillmodus" }
  }

  if (modeRaw === "daily") {
    if (!challengeDateRaw || !isValidChallengeDate(challengeDateRaw)) {
      return { ok: false, error: "Ugyldig dato for dagens utfordring" }
    }
    return {
      ok: true,
      name,
      score,
      level,
      difficulty,
      mode: "daily",
      challengeDate: challengeDateRaw,
    }
  }

  return {
    ok: true,
    name,
    score,
    level,
    difficulty,
    mode: "blitz",
    challengeDate: null,
  }
}
