"use client"

import { comboHeat } from "@/lib/game-juice"

interface GameStatsProps {
  score: number
  highScore: number
  lives: number
  maxLives: number
  streak: number
  level: number
  timeElapsed: number
  /** Når satt: vis fremdrift i dagens utfordring (bokført / totalt). */
  dailyProgress?: { cleared: number; total: number } | null
}

export function GameStats({
  score,
  highScore,
  lives,
  maxLives,
  streak,
  level,
  timeElapsed,
  dailyProgress = null,
}: GameStatsProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const heat = comboHeat(streak)
  const streakClass =
    heat === "blitz"
      ? "heat-blitz"
      : heat === "hot"
        ? "heat-hot"
        : heat === "warm"
          ? "heat-warm"
          : "text-paper-bright"

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-ink px-4 py-3 text-paper-bright shadow-lg">
      <div className="flex items-center gap-5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.14em] text-paper-bright/45">Poeng</p>
          <p className="font-mono text-2xl font-bold text-stamp-soft tabular-nums">
            {score.toLocaleString("nb-NO")}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.14em] text-paper-bright/45">Rekord</p>
          <p className="font-mono text-lg text-paper-bright/80 tabular-nums">
            {highScore.toLocaleString("nb-NO")}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.14em] text-paper-bright/45">Nivå</p>
          <p className="font-display text-xl font-bold text-moss-bright">{level}</p>
        </div>
        <div className="relative text-center">
          <p className="text-[10px] uppercase tracking-[0.14em] text-paper-bright/45">Streak</p>
          <p
            className={`font-display text-xl font-bold ${streakClass} ${
              streak >= 3 ? "animate-streak-pulse" : ""
            }`}
          >
            {streak}
          </p>
          {streak >= 3 && (
            <span className="animate-streak-badge absolute -right-8 -top-1 rounded-full bg-stamp px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-accent-foreground">
              x{streak}
            </span>
          )}
        </div>
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.14em] text-paper-bright/45">Tid</p>
          <p className="font-mono text-lg text-paper-bright/80">{formatTime(timeElapsed)}</p>
        </div>
        {dailyProgress && (
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[0.14em] text-paper-bright/45">Dagens</p>
            <p className="font-mono text-lg text-stamp-soft tabular-nums">
              {dailyProgress.cleared}/{dailyProgress.total}
            </p>
          </div>
        )}
      </div>

      <div>
        <p className="mb-1 text-[10px] uppercase tracking-[0.14em] text-paper-bright/45">Liv</p>
        <div className="flex gap-1" aria-label={`${lives} av ${maxLives} liv`}>
          {Array.from({ length: maxLives }).map((_, i) => (
            <div
              key={i}
              className={`flex h-6 w-6 items-center justify-center rounded-full text-sm transition-all ${
                i < lives
                  ? "scale-100 bg-danger text-white"
                  : "scale-90 bg-paper-bright/15 text-paper-bright/30"
              }`}
              aria-hidden
            >
              ♥
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
