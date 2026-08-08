import { describe, expect, it } from "vitest"

import {
  accuracyPercent,
  comboHeat,
  dangerProximity,
  emptySessionStats,
  getComboMilestone,
  rankTitle,
  recordCorrect,
  recordMiss,
  recordWrong,
} from "@/lib/game-juice"

describe("session stats", () => {
  it("tracks accuracy and best streak", () => {
    let stats = emptySessionStats()
    stats = recordCorrect(stats, 1, 1)
    stats = recordCorrect(stats, 2, 1)
    stats = recordWrong(stats)
    stats = recordMiss(stats)
    stats = recordCorrect(stats, 1, 2)
    expect(stats.correct).toBe(3)
    expect(stats.wrong).toBe(1)
    expect(stats.misses).toBe(1)
    expect(stats.bestStreak).toBe(2)
    expect(stats.maxLevel).toBe(2)
    expect(accuracyPercent(stats)).toBe(60)
  })
})

describe("combo milestones", () => {
  it("fires only on exact streak thresholds", () => {
    expect(getComboMilestone(3)?.label).toBe("På rad!")
    expect(getComboMilestone(5)?.label).toBe("Blitz!")
    expect(getComboMilestone(4)).toBeNull()
  })

  it("maps heat tiers", () => {
    expect(comboHeat(0)).toBe("cool")
    expect(comboHeat(5)).toBe("warm")
    expect(comboHeat(8)).toBe("hot")
    expect(comboHeat(20)).toBe("blitz")
  })
})

describe("dangerProximity", () => {
  it("is 0 high up and 1 at the line", () => {
    expect(dangerProximity(0, 520)).toBe(0)
    expect(dangerProximity(520 - 20, 520)).toBe(1)
    expect(dangerProximity(520 * 0.55 + 10, 520)).toBeGreaterThan(0)
    expect(dangerProximity(520 * 0.55 + 10, 520)).toBeLessThan(1)
  })
})

describe("rankTitle", () => {
  it("escalates with performance", () => {
    expect(rankTitle(emptySessionStats(), 0)).toBe("Praktikant")
    expect(rankTitle({ ...emptySessionStats(), bestStreak: 5, correct: 10 }, 1200)).toBe(
      "Autorisert"
    )
    expect(rankTitle({ ...emptySessionStats(), bestStreak: 12 }, 6000)).toBe("Byråpartner")
  })
})
