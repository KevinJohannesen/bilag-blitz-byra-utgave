import { describe, expect, it } from "vitest"

import { ACCOUNTS } from "@/lib/accounting-data"
import {
  DAILY_TRANSACTION_COUNT,
  createSeededRng,
  didClearDaily,
  getDailySeed,
  getDailyTransactions,
  getOsloDateString,
  isValidChallengeDate,
} from "@/lib/daily-challenge"

describe("daily challenge dating", () => {
  it("formats Oslo calendar dates as YYYY-MM-DD", () => {
    // 2026-04-08 22:30 UTC = 2026-04-09 00:30 in Oslo (CEST)
    const aroundMidnight = new Date("2026-04-08T22:30:00.000Z")
    expect(getOsloDateString(aroundMidnight)).toBe("2026-04-09")

    const afternoonUtc = new Date("2026-01-15T12:00:00.000Z")
    expect(getOsloDateString(afternoonUtc)).toBe("2026-01-15")
  })

  it("validates challenge dates", () => {
    expect(isValidChallengeDate("2026-04-08")).toBe(true)
    expect(isValidChallengeDate("2026-02-30")).toBe(false)
    expect(isValidChallengeDate("26-04-08")).toBe(false)
  })
})

describe("getDailyTransactions", () => {
  it("is deterministic for the same date and difficulty", () => {
    const a = getDailyTransactions("medium", "2026-04-08")
    const b = getDailyTransactions("medium", "2026-04-08")
    expect(a).toHaveLength(DAILY_TRANSACTION_COUNT)
    expect(b).toEqual(a)
  })

  it("differs across dates and difficulties", () => {
    const a = getDailyTransactions("medium", "2026-04-08")
    const b = getDailyTransactions("medium", "2026-04-09")
    const c = getDailyTransactions("hard", "2026-04-08")
    expect(a.map((t) => `${t.description}:${t.amount}:${t.company}`)).not.toEqual(
      b.map((t) => `${t.description}:${t.amount}:${t.company}`)
    )
    expect(a.map((t) => `${t.description}:${t.amount}:${t.company}`)).not.toEqual(
      c.map((t) => `${t.description}:${t.amount}:${t.company}`)
    )
  })

  it("maps every bilag to a known NS 4102 account", () => {
    const codes = new Set(ACCOUNTS.map((a) => a.code))
    for (const tx of getDailyTransactions("expert", "2026-08-08")) {
      expect(codes.has(tx.correctAccount)).toBe(true)
      expect(tx.id).toMatch(/^daily-2026-08-08-\d+$/)
      expect(tx.explain.length).toBeGreaterThan(10)
    }
  })

  it("uses stable seeds", () => {
    expect(getDailySeed("2026-04-08", "medium")).toBe(getDailySeed("2026-04-08", "medium"))
    expect(getDailySeed("2026-04-08", "medium")).not.toBe(getDailySeed("2026-04-08", "hard"))
  })
})

describe("createSeededRng", () => {
  it("repeats the same sequence", () => {
    const a = createSeededRng(42)
    const b = createSeededRng(42)
    expect([a(), a(), a()]).toEqual([b(), b(), b()])
  })
})

describe("didClearDaily", () => {
  it("requires full spawn and remaining lives", () => {
    expect(
      didClearDaily({ spawnedCount: 15, livesRemaining: 1, total: 15 })
    ).toBe(true)
    expect(
      didClearDaily({ spawnedCount: 15, livesRemaining: 0, total: 15 })
    ).toBe(false)
    expect(
      didClearDaily({ spawnedCount: 14, livesRemaining: 2, total: 15 })
    ).toBe(false)
  })
})
