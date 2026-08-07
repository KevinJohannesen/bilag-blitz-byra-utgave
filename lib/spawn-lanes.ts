import { SPAWN_LANES } from "@/lib/accounting-data"

export interface LaneOccupant {
  lane: number
  positionY: number
  isCorrect: boolean | null
}

/** Bilag nearer the top than this block their lane from new spawns. */
export const LANE_BLOCK_Y = 200

export function pickSpawnLane(
  active: LaneOccupant[],
  options: { blockY?: number; lanes?: readonly number[] } = {}
): number | null {
  const blockY = options.blockY ?? LANE_BLOCK_Y
  const lanes = options.lanes ?? SPAWN_LANES
  const blocking = active.filter(
    (tx) => tx.isCorrect === null && tx.positionY < blockY
  )
  const freeLanes = lanes.map((_, index) => index).filter(
    (lane) => !blocking.some((tx) => tx.lane === lane)
  )

  if (freeLanes.length === 0) return null

  freeLanes.sort((a, b) => {
    const countA = active.filter((tx) => tx.lane === a && tx.isCorrect === null).length
    const countB = active.filter((tx) => tx.lane === b && tx.isCorrect === null).length
    return countA - countB
  })

  return freeLanes[0] ?? null
}
