export interface SessionStats {
  correct: number
  wrong: number
  misses: number
  bestStreak: number
  maxLevel: number
}

export interface ComboMilestone {
  streak: number
  label: string
  subtitle: string
}

export const COMBO_MILESTONES: ComboMilestone[] = [
  { streak: 3, label: "På rad!", subtitle: "Du har rytmen" },
  { streak: 5, label: "Blitz!", subtitle: "Stemplene sitter" },
  { streak: 8, label: "Revisor!", subtitle: "Under kontroll" },
  { streak: 12, label: "Partner!", subtitle: "Byrået er stolt" },
  { streak: 20, label: "Legende!", subtitle: "NS 4102 i blodet" },
]

export function emptySessionStats(): SessionStats {
  return { correct: 0, wrong: 0, misses: 0, bestStreak: 0, maxLevel: 1 }
}

export function recordCorrect(stats: SessionStats, nextStreak: number, level: number): SessionStats {
  return {
    ...stats,
    correct: stats.correct + 1,
    bestStreak: Math.max(stats.bestStreak, nextStreak),
    maxLevel: Math.max(stats.maxLevel, level),
  }
}

export function recordWrong(stats: SessionStats): SessionStats {
  return { ...stats, wrong: stats.wrong + 1 }
}

export function recordMiss(stats: SessionStats): SessionStats {
  return { ...stats, misses: stats.misses + 1 }
}

export function accuracyPercent(stats: SessionStats): number {
  const total = stats.correct + stats.wrong + stats.misses
  if (total === 0) return 0
  return Math.round((stats.correct / total) * 100)
}

export function getComboMilestone(streak: number): ComboMilestone | null {
  return COMBO_MILESTONES.find((m) => m.streak === streak) ?? null
}

export function comboHeat(streak: number): "cool" | "warm" | "hot" | "blitz" {
  if (streak >= 12) return "blitz"
  if (streak >= 8) return "hot"
  if (streak >= 5) return "warm"
  return "cool"
}

/** 0–1 how close the active bilag is to the danger line */
export function dangerProximity(
  positionY: number,
  gameHeight: number,
  receiptHeight = 160
): number {
  const dangerStart = gameHeight * 0.55
  const dangerEnd = gameHeight - 20
  if (positionY < dangerStart) return 0
  if (positionY >= dangerEnd) return 1
  return (positionY - dangerStart) / (dangerEnd - dangerStart)
}

export function rankTitle(stats: SessionStats, score: number): string {
  if (score >= 5000 || stats.bestStreak >= 12) return "Byråpartner"
  if (score >= 2500 || stats.bestStreak >= 8) return "Senior"
  if (score >= 1000 || stats.bestStreak >= 5) return "Autorisert"
  if (stats.correct >= 5) return "Junior"
  return "Praktikant"
}
