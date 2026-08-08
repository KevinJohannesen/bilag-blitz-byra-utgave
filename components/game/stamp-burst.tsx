"use client"

interface StampBurstProps {
  show: boolean
  label?: string
}

export function StampBurst({ show, label = "BOKFØRT" }: StampBurstProps) {
  if (!show) return null

  return (
    <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center">
      <div
        key={label}
        className="animate-stamp-hit rotate-[-12deg] rounded-lg border-[3px] border-stamp px-5 py-2 font-display text-3xl font-extrabold tracking-[0.18em] text-stamp shadow-[0_0_0_4px_rgba(196,92,38,0.15)] md:text-4xl"
      >
        {label}
      </div>
    </div>
  )
}
