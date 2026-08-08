import { describe, expect, it } from "vitest"

import { parseSubmitBody } from "@/lib/leaderboard-validation"

describe("parseSubmitBody", () => {
  it("accepts a valid payload and trims name", () => {
    const parsed = parseSubmitBody({
      name: "  Ada  ",
      score: 150.9,
      level: 2.2,
      difficulty: "hard",
    })
    expect(parsed).toEqual({
      ok: true,
      name: "Ada",
      score: 150,
      level: 2,
      difficulty: "hard",
      mode: "blitz",
      challengeDate: null,
    })
  })

  it("defaults empty name to Anonym and caps length", () => {
    const parsed = parseSubmitBody({
      name: "   ",
      score: 10,
      level: 1,
      difficulty: "easy",
    })
    expect(parsed.ok && parsed.name).toBe("Anonym")

    const long = parseSubmitBody({
      name: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      score: 10,
      level: 1,
      difficulty: "easy",
    })
    expect(long.ok && long.name).toHaveLength(16)
  })

  it("accepts daily mode with a valid challenge date", () => {
    const parsed = parseSubmitBody({
      name: "Kari",
      score: 900,
      level: 3,
      difficulty: "medium",
      mode: "daily",
      challengeDate: "2026-04-08",
    })
    expect(parsed).toEqual({
      ok: true,
      name: "Kari",
      score: 900,
      level: 3,
      difficulty: "medium",
      mode: "daily",
      challengeDate: "2026-04-08",
    })
  })

  it("rejects daily mode without a valid date", () => {
    expect(
      parseSubmitBody({
        score: 10,
        level: 1,
        difficulty: "easy",
        mode: "daily",
      }).ok
    ).toBe(false)
    expect(
      parseSubmitBody({
        score: 10,
        level: 1,
        difficulty: "easy",
        mode: "daily",
        challengeDate: "2026-13-40",
      }).ok
    ).toBe(false)
  })

  it("rejects invalid score, level, and difficulty", () => {
    expect(parseSubmitBody({ score: 0, level: 1, difficulty: "easy" }).ok).toBe(false)
    expect(parseSubmitBody({ score: 10, level: 0, difficulty: "easy" }).ok).toBe(false)
    expect(parseSubmitBody({ score: 10, level: 1, difficulty: "nope" }).ok).toBe(false)
    expect(parseSubmitBody(null).ok).toBe(false)
  })
})
