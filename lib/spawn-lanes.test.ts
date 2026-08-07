import { describe, expect, it } from "vitest"

import { pickSpawnLane, type LaneOccupant } from "@/lib/spawn-lanes"

function tx(partial: Partial<LaneOccupant> & Pick<LaneOccupant, "lane">): LaneOccupant {
  return {
    positionY: 0,
    isCorrect: null,
    ...partial,
  }
}

describe("pickSpawnLane", () => {
  it("returns the least occupied free lane", () => {
    const active = [tx({ lane: 0, positionY: 300 }), tx({ lane: 0, positionY: 400 })]
    expect(pickSpawnLane(active, { blockY: 200 })).toBe(1)
  })

  it("treats near-top receipts as blocking their lane", () => {
    const active = [
      tx({ lane: 0, positionY: 50 }),
      tx({ lane: 1, positionY: 50 }),
      tx({ lane: 2, positionY: 50 }),
    ]
    expect(pickSpawnLane(active, { blockY: 200 })).toBeNull()
  })

  it("ignores resolved receipts for blocking", () => {
    const active = [
      tx({ lane: 0, positionY: 50, isCorrect: true }),
      tx({ lane: 1, positionY: 50, isCorrect: false }),
    ]
    expect(pickSpawnLane(active, { blockY: 200 })).toBe(0)
  })
})
