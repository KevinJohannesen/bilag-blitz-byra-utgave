import { and, desc, eq, isNull, or } from "drizzle-orm"
import { NextResponse } from "next/server"

import { isValidChallengeDate } from "@/lib/daily-challenge"
import { getDb } from "@/lib/db"
import { leaderboardScores } from "@/lib/db/schema"
import {
  HighScoreEntry,
  MAX_ENTRIES,
  isValidDifficulty,
  qualifiesForLeaderboard,
  sortLeaderboard,
} from "@/lib/highscore"
import {
  isValidLeaderboardMode,
  parseSubmitBody,
  type LeaderboardMode,
} from "@/lib/leaderboard-validation"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function toEntry(row: typeof leaderboardScores.$inferSelect): HighScoreEntry {
  return {
    name: row.name,
    score: row.score,
    level: row.level,
    difficulty: row.difficulty,
    date: row.createdAt.toISOString(),
    mode: (row.mode === "daily" ? "daily" : "blitz") as LeaderboardMode,
    challengeDate: row.challengeDate,
  }
}

async function getTopEntries(params: {
  difficulty?: string
  mode: LeaderboardMode
  challengeDate?: string
}): Promise<HighScoreEntry[]> {
  const db = getDb()
  const { difficulty, mode, challengeDate } = params

  const filters = []

  if (mode === "daily") {
    filters.push(eq(leaderboardScores.mode, "daily"))
    if (challengeDate) filters.push(eq(leaderboardScores.challengeDate, challengeDate))
  } else {
    // Bakoverkompat: gamle rader uten mode behandles som blitz
    filters.push(or(eq(leaderboardScores.mode, "blitz"), isNull(leaderboardScores.mode))!)
  }

  if (difficulty) {
    filters.push(eq(leaderboardScores.difficulty, difficulty))
  }

  const rows = await db
    .select()
    .from(leaderboardScores)
    .where(filters.length === 1 ? filters[0] : and(...filters))
    .orderBy(desc(leaderboardScores.score), desc(leaderboardScores.createdAt))
    .limit(MAX_ENTRIES)

  return sortLeaderboard(rows.map(toEntry))
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const difficulty = searchParams.get("difficulty") ?? undefined
    const modeRaw = searchParams.get("mode") ?? "blitz"
    const challengeDate = searchParams.get("date") ?? undefined

    if (difficulty && !isValidDifficulty(difficulty)) {
      return NextResponse.json({ error: "Ugyldig vanskelighetsgrad" }, { status: 400 })
    }
    if (!isValidLeaderboardMode(modeRaw)) {
      return NextResponse.json({ error: "Ugyldig spillmodus" }, { status: 400 })
    }
    if (challengeDate && !isValidChallengeDate(challengeDate)) {
      return NextResponse.json({ error: "Ugyldig dato" }, { status: 400 })
    }
    if (modeRaw === "daily" && !challengeDate) {
      return NextResponse.json(
        { error: "Dato kreves for dagens utfordring" },
        { status: 400 }
      )
    }

    const entries = await getTopEntries({
      difficulty,
      mode: modeRaw,
      challengeDate,
    })
    return NextResponse.json({
      entries,
      difficulty: difficulty ?? null,
      mode: modeRaw,
      date: challengeDate ?? null,
    })
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

    const { name, score, level, difficulty, mode, challengeDate } = parsed
    const current = await getTopEntries({
      difficulty,
      mode,
      challengeDate: challengeDate ?? undefined,
    })
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
      mode,
      challengeDate,
    })

    const entries = await getTopEntries({
      difficulty,
      mode,
      challengeDate: challengeDate ?? undefined,
    })
    return NextResponse.json(
      { entries, difficulty, mode, date: challengeDate },
      { status: 201 }
    )
  } catch (error) {
    console.error("POST /api/leaderboard failed", error)
    return NextResponse.json({ error: "Kunne ikke lagre rekorden" }, { status: 500 })
  }
}
