import { desc } from "drizzle-orm"
import { NextResponse } from "next/server"

import { getDb } from "@/lib/db"
import { leaderboardScores } from "@/lib/db/schema"
import {
  HighScoreEntry,
  MAX_ENTRIES,
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

async function getTopEntries(): Promise<HighScoreEntry[]> {
  const db = getDb()
  const rows = await db
    .select()
    .from(leaderboardScores)
    .orderBy(desc(leaderboardScores.score), desc(leaderboardScores.createdAt))
    .limit(MAX_ENTRIES)

  return sortLeaderboard(rows.map(toEntry))
}

export async function GET() {
  try {
    const entries = await getTopEntries()
    return NextResponse.json({ entries })
  } catch (error) {
    console.error("GET /api/leaderboard failed", error)
    return NextResponse.json(
      { error: "Kunne ikke hente topplisten" },
      { status: 500 }
    )
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
    const current = await getTopEntries()
    if (!qualifiesForLeaderboard(current, score)) {
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

    const entries = await getTopEntries()
    return NextResponse.json({ entries }, { status: 201 })
  } catch (error) {
    console.error("POST /api/leaderboard failed", error)
    return NextResponse.json(
      { error: "Kunne ikke lagre rekorden" },
      { status: 500 }
    )
  }
}
