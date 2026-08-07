"use client"

interface GameStatsProps {
  score: number
  highScore: number
  lives: number
  maxLives: number
  streak: number
  level: number
  timeElapsed: number
}

export function GameStats({
  score,
  highScore,
  lives,
  maxLives,
  streak,
  level,
  timeElapsed,
}: GameStatsProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-ink px-4 py-3 text-paper-bright shadow-lg">
      <div className="flex items-center gap-5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.14em] text-paper-bright/45">Poeng</p>
          <p className="font-mono text-2xl font-bold text-stamp-soft">{score.toLocaleString("nb-NO")}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.14em] text-paper-bright/45">Rekord</p>
          <p className="font-mono text-lg text-paper-bright/80">{highScore.toLocaleString("nb-NO")}</p>
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
            className={`font-display text-xl font-bold ${
              streak >= 3 ? "animate-streak-pulse text-stamp-soft" : "text-paper-bright"
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
      </div>

      <div>
        <p className="mb-1 text-[10px] uppercase tracking-[0.14em] text-paper-bright/45">Liv</p>
        <div className="flex gap-1" aria-label={`${lives} av ${maxLives} liv`}>
          {Array.from({ length: maxLives }).map((_, i) => (
            <div
              key={i}
              className={`flex h-6 w-6 items-center justify-center rounded-full text-sm transition-colors ${
                i < lives
                  ? "bg-danger text-white"
                  : "bg-paper-bright/15 text-paper-bright/30"
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
