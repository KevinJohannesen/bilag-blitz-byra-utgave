"use client"

export interface FloatingPoint {
  id: string
  points: number
  x: number
  y: number
}

interface FloatingPointsProps {
  items: FloatingPoint[]
}

export function FloatingPoints({ items }: FloatingPointsProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {items.map((item) => (
        <span
          key={item.id}
          className="animate-float-points absolute font-mono text-lg font-bold text-stamp"
          style={{ left: `${item.x}%`, top: item.y }}
        >
          +{item.points}
        </span>
      ))}
    </div>
  )
}
