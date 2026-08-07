"use client"

import type { ComboMilestone } from "@/lib/game-juice"

interface ComboBannerProps {
  milestone: ComboMilestone | null
}

export function ComboBanner({ milestone }: ComboBannerProps) {
  if (!milestone) return null

  return (
    <div
      key={milestone.streak}
      className="pointer-events-none absolute inset-x-0 top-[18%] z-30 flex justify-center px-4"
    >
      <div className="animate-combo-slam rounded-2xl border-2 border-stamp bg-ink/92 px-8 py-4 text-center shadow-[0_20px_50px_rgba(15,31,28,0.45)] backdrop-blur-sm">
        <p className="font-display text-3xl font-extrabold tracking-tight text-stamp-soft md:text-4xl">
          {milestone.label}
        </p>
        <p className="mt-1 text-sm text-paper-bright/70">{milestone.subtitle}</p>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-moss-bright">
          {milestone.streak} på rad
        </p>
      </div>
    </div>
  )
}
