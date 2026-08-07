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

  it("rejects invalid score, level, and difficulty", () => {
    expect(parseSubmitBody({ score: 0, level: 1, difficulty: "easy" }).ok).toBe(false)
    expect(parseSubmitBody({ score: 10, level: 0, difficulty: "easy" }).ok).toBe(false)
    expect(parseSubmitBody({ score: 10, level: 1, difficulty: "nope" }).ok).toBe(false)
    expect(parseSubmitBody(null).ok).toBe(false)
  })
})
