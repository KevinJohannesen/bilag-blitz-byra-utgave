"use client"

import { Transaction } from "@/lib/accounting-data"

interface FallingReceiptProps {
  transaction: Transaction
  positionY: number
  positionX: number
  isCorrect: boolean | null
  isActive: boolean
}

export function FallingReceipt({
  transaction,
  positionY,
  positionX,
  isCorrect,
  isActive,
}: FallingReceiptProps) {
  const getReceiptStyle = () => {
    if (isCorrect === true) return "ring-2 ring-moss bg-emerald-50/90"
    if (isCorrect === false) return "ring-2 ring-danger bg-red-50/90"
    if (isActive)
      return "animate-active-receipt ring-[3px] ring-stamp bg-[#fff8ef] shadow-[0_0_0_6px_rgba(196,92,38,0.22)] scale-[1.02]"
    return "receipt-paper"
  }

  return (
    <div
      className={`absolute will-change-transform ${getReceiptStyle()}`}
      style={{
        transform: `translate(-50%, 0) translateY(${positionY}px)`,
        left: `${positionX}%`,
        top: 0,
        width: "240px",
      }}
    >
      <div className="relative">
        <div
          className="absolute -top-2 left-0 right-0 h-2 bg-[#fffef8]"
          style={{
            clipPath:
              "polygon(0% 100%, 5% 50%, 10% 100%, 15% 50%, 20% 100%, 25% 50%, 30% 100%, 35% 50%, 40% 100%, 45% 50%, 50% 100%, 55% 50%, 60% 100%, 65% 50%, 70% 100%, 75% 50%, 80% 100%, 85% 50%, 90% 100%, 95% 50%, 100% 100%)",
          }}
        />

        <div className="border border-ink/10 px-3.5 py-3 shadow-[0_10px_28px_rgba(15,31,28,0.14)]">
          <div className="mb-2 border-b border-dashed border-ink/15 pb-2 text-center">
            <p className="font-mono text-[10px] tracking-wide text-ink/45">{transaction.date}</p>
            <p className="truncate text-sm font-semibold text-ink">{transaction.company}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm leading-snug text-ink/75">{transaction.description}</p>
            <div className="flex items-center justify-between border-t border-dashed border-ink/15 pt-2">
              <span className="text-[11px] uppercase tracking-wider text-ink/45">Beløp</span>
              <span className="font-mono text-base font-semibold text-ink">
                kr {transaction.amount.toLocaleString("nb-NO")}
              </span>
            </div>
          </div>

          {isActive && isCorrect === null && (
            <div className="mt-2 animate-pulse-stamp rounded bg-stamp px-2 py-1.5 text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-accent-foreground">
                Aktivt bilag
              </p>
            </div>
          )}
        </div>

        <div
          className="absolute -bottom-2 left-0 right-0 h-2 bg-[#f7f1e4]"
          style={{
            clipPath:
              "polygon(0% 0%, 5% 50%, 10% 0%, 15% 50%, 20% 0%, 25% 50%, 30% 0%, 35% 50%, 40% 0%, 45% 50%, 50% 0%, 55% 50%, 60% 0%, 65% 50%, 70% 0%, 75% 50%, 80% 0%, 85% 50%, 90% 0%, 95% 50%, 100% 0%)",
          }}
        />
      </div>

      {isCorrect !== null && (
        <div
          className={`absolute inset-0 flex items-center justify-center ${
            isCorrect ? "bg-moss/20" : "bg-danger/20"
          }`}
        >
          <span
            className={`font-display text-4xl font-bold ${
              isCorrect ? "text-moss" : "text-danger"
            }`}
          >
            {isCorrect ? "✓" : "✗"}
          </span>
        </div>
      )}
    </div>
  )
}
