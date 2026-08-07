import { isValidDifficulty } from "@/lib/highscore"

export type ParsedSubmitBody =
  | {
      ok: true
      name: string
      score: number
      level: number
      difficulty: string
    }
  | { ok: false; error: string }

export function parseSubmitBody(body: unknown): ParsedSubmitBody {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Ugyldig forespørsel" }
  }

  const raw = body as {
    name?: unknown
    score?: unknown
    level?: unknown
    difficulty?: unknown
  }

  const name =
    typeof raw.name === "string" ? raw.name.trim().slice(0, 16) || "Anonym" : "Anonym"
  const score = typeof raw.score === "number" ? Math.floor(raw.score) : NaN
  const level = typeof raw.level === "number" ? Math.floor(raw.level) : NaN
  const difficulty = typeof raw.difficulty === "string" ? raw.difficulty : ""

  if (!Number.isFinite(score) || score <= 0 || score > 1_000_000) {
    return { ok: false, error: "Ugyldig poengsum" }
  }
  if (!Number.isFinite(level) || level < 1 || level > 10_000) {
    return { ok: false, error: "Ugyldig nivå" }
  }
  if (!isValidDifficulty(difficulty)) {
    return { ok: false, error: "Ugyldig vanskelighetsgrad" }
  }

  return { ok: true, name, score, level, difficulty }
}
