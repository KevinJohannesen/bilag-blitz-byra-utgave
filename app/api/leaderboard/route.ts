import { desc, eq } from "drizzle-orm"
import { NextResponse } from "next/server"

import { getDb } from "@/lib/db"
import { leaderboardScores } from "@/lib/db/schema"
import {
  HighScoreEntry,
  MAX_ENTRIES,
  isValidDifficulty,
  qualifiesForLeaderboard,
  sortLeaderboard,
} from "@/lib/highscore"
import { parseSubmitBody } from "@/lib/leaderboard-validation"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function toEntry(row: typeof leaderboardScores.$inferSelect): HighScoreEntry {
  return {
    name: row.name,
    score: row.score,
    level: row.level,
    difficulty: row.difficulty,
    date: row.createdAt.toISOString(),
  }
}

async function getTopEntries(difficulty?: string): Promise<HighScoreEntry[]> {
  const db = getDb()
  const rows = difficulty
    ? await db
        .select()
        .from(leaderboardScores)
        .where(eq(leaderboardScores.difficulty, difficulty))
        .orderBy(desc(leaderboardScores.score), desc(leaderboardScores.createdAt))
        .limit(MAX_ENTRIES)
    : await db
        .select()
        .from(leaderboardScores)
        .orderBy(desc(leaderboardScores.score), desc(leaderboardScores.createdAt))
        .limit(MAX_ENTRIES)

  return sortLeaderboard(rows.map(toEntry))
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const difficulty = searchParams.get("difficulty") ?? undefined
    if (difficulty && !isValidDifficulty(difficulty)) {
      return NextResponse.json({ error: "Ugyldig vanskelighetsgrad" }, { status: 400 })
    }

    const entries = await getTopEntries(difficulty)
    return NextResponse.json({ entries, difficulty: difficulty ?? null })
  } catch (error) {
    console.error("GET /api/leaderboard failed", error)
    return NextResponse.json({ error: "Kunne ikke hente topplisten" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = parseSubmitBody(body)
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 })
    }

    const { name, score, level, difficulty } = parsed
    const current = await getTopEntries(difficulty)
    if (!qualifiesForLeaderboard(current, score, difficulty)) {
      return NextResponse.json(
        { error: "Poengsummen kvalifiserer ikke til topplisten", entries: current },
        { status: 409 }
      )
    }

    const db = getDb()
    await db.insert(leaderboardScores).values({
      name,
      score,
      level,
      difficulty,
    })

    // Keep response scoped to the same difficulty board the player competed on
    const entries = await getTopEntries(difficulty)
    return NextResponse.json({ entries, difficulty }, { status: 201 })
  } catch (error) {
    console.error("POST /api/leaderboard failed", error)
    return NextResponse.json({ error: "Kunne ikke lagre rekorden" }, { status: 500 })
  }
}
