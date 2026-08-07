import { describe, expect, it } from "vitest"

import {
  MAX_ENTRIES,
  getBestScore,
  isValidDifficulty,
  qualifiesForLeaderboard,
  sortLeaderboard,
  type HighScoreEntry,
} from "@/lib/highscore"

function entry(
  overrides: Partial<HighScoreEntry> & Pick<HighScoreEntry, "score">
): HighScoreEntry {
  return {
    name: "Test",
    level: 1,
    difficulty: "medium",
    date: "2026-01-01T00:00:00.000Z",
    ...overrides,
  }
}

describe("sortLeaderboard", () => {
  it("sorts by score descending and caps at MAX_ENTRIES", () => {
    const input = Array.from({ length: MAX_ENTRIES + 3 }, (_, i) =>
      entry({ score: i + 1, name: `P${i}` })
    )
    const sorted = sortLeaderboard(input)
    expect(sorted).toHaveLength(MAX_ENTRIES)
    expect(sorted[0]?.score).toBe(MAX_ENTRIES + 3)
    expect(sorted.at(-1)?.score).toBe(4)
  })
})

describe("getBestScore", () => {
  const board = [
    entry({ score: 100, difficulty: "easy" }),
    entry({ score: 400, difficulty: "hard" }),
    entry({ score: 250, difficulty: "medium" }),
  ]

  it("returns global best without difficulty filter", () => {
    expect(getBestScore(board)).toBe(400)
  })

  it("filters by difficulty", () => {
    expect(getBestScore(board, "medium")).toBe(250)
    expect(getBestScore(board, "expert")).toBe(0)
  })
})

describe("qualifiesForLeaderboard", () => {
  it("rejects non-positive scores", () => {
    expect(qualifiesForLeaderboard([], 0)).toBe(false)
    expect(qualifiesForLeaderboard([], -1)).toBe(false)
  })

  it("accepts any positive score when board has room", () => {
    expect(qualifiesForLeaderboard([entry({ score: 50 })], 1)).toBe(true)
  })

  it("requires beating the lowest when board is full", () => {
    const full = Array.from({ length: MAX_ENTRIES }, (_, i) =>
      entry({ score: (i + 1) * 10 })
    )
    const sorted = sortLeaderboard(full)
    const lowest = sorted.at(-1)!.score
    expect(qualifiesForLeaderboard(sorted, lowest)).toBe(false)
    expect(qualifiesForLeaderboard(sorted, lowest + 1)).toBe(true)
  })

  it("scopes qualification to difficulty when provided", () => {
    const board = Array.from({ length: MAX_ENTRIES }, (_, i) =>
      entry({ score: 1000 + i, difficulty: "easy" })
    )
    board.push(entry({ score: 50, difficulty: "expert" }))
    expect(qualifiesForLeaderboard(board, 51, "expert")).toBe(true)
    expect(qualifiesForLeaderboard(board, 999, "easy")).toBe(false)
  })
})

describe("isValidDifficulty", () => {
  it("accepts known difficulties only", () => {
    expect(isValidDifficulty("easy")).toBe(true)
    expect(isValidDifficulty("medium")).toBe(true)
    expect(isValidDifficulty("hard")).toBe(true)
    expect(isValidDifficulty("expert")).toBe(true)
    expect(isValidDifficulty("insane")).toBe(false)
    expect(isValidDifficulty("")).toBe(false)
  })
})
