"use client"

import { useEffect, useRef } from "react"
import { ACCOUNTS } from "@/lib/accounting-data"

export interface LastResult {
  correct: boolean
  account: string
  expected: string
  pointsEarned?: number
  /** Shown on wrong answer / miss */
  expectedName?: string
  nearMissTip?: string | null
  reason?: "wrong" | "miss"
}

interface AccountInputProps {
  inputValue: string
  onInputChange: (value: string) => void
  onSubmit: () => void
  lastResult: LastResult | null
  activeHint?: { description: string; company: string } | null
  softHint?: string | null
  focusToken?: number
  submitLabel?: string
}

export function AccountInput({
  inputValue,
  onInputChange,
  onSubmit,
  lastResult,
  activeHint,
  softHint,
  focusToken = 0,
  submitLabel = "Bokfør",
}: AccountInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (focusToken > 0) inputRef.current?.focus()
  }, [focusToken])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") onSubmit()
  }

  return (
    <div className="sticky bottom-0 z-10 rounded-xl bg-ink p-4 text-paper-bright shadow-lg md:static">
      {activeHint && (
        <p className="mb-3 text-sm text-paper-bright/75">
          <span className="text-paper-bright/45">Bokfør: </span>
          <span className="font-medium text-stamp-soft">{activeHint.description}</span>
          <span className="text-paper-bright/40"> · {activeHint.company}</span>
        </p>
      )}

      {softHint && !lastResult && (
        <p className="mb-3 animate-result-pop rounded-lg border border-stamp/30 bg-stamp/10 px-3 py-2 text-xs text-stamp-soft">
          {softHint}
        </p>
      )}

      <label className="mb-2 block text-[11px] uppercase tracking-[0.14em] text-paper-bright/45">
        Kontokode
      </label>
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value.replace(/\D/g, "").slice(0, 4))}
          onKeyDown={handleKeyDown}
          placeholder="1920"
          className="flex-1 rounded-lg border border-paper-bright/15 bg-ink-soft px-4 py-3 text-center font-mono text-2xl tracking-[0.35em] text-paper-bright placeholder:text-paper-bright/25 focus:outline-none focus:ring-2 focus:ring-stamp"
          autoFocus
        />
        <button
          onClick={onSubmit}
          className="rounded-lg bg-stamp px-6 py-3 font-display font-bold text-accent-foreground transition-colors hover:bg-stamp-soft hover:text-ink"
        >
          {submitLabel}
        </button>
      </div>

      {lastResult && (
        <div
          className={`mt-2 rounded-lg p-3 text-sm font-medium ${
            lastResult.correct
              ? "animate-result-pop border border-moss/40 bg-moss/20 text-moss-bright"
              : "border border-danger/40 bg-danger/20 text-red-200"
          }`}
        >
          {lastResult.correct ? (
            <span className="flex items-center justify-between gap-3">
              <span>Riktig! Konto {lastResult.account}</span>
              {typeof lastResult.pointsEarned === "number" && (
                <span className="animate-points-pop font-mono font-bold text-stamp-soft">
                  +{lastResult.pointsEarned}
                </span>
              )}
            </span>
          ) : (
            <div>
              <span className="block font-bold text-red-100">
                {lastResult.reason === "miss"
                  ? "−1 liv — bilaget passerte linjen"
                  : "−1 liv — feil kontokode"}
              </span>
              <span className="mt-1 block text-paper-bright/80">
                {lastResult.account ? (
                  <>
                    Du skrev: <span className="font-mono">{lastResult.account}</span>
                    {" · "}
                  </>
                ) : null}
                Riktig:{" "}
                <span className="font-mono text-stamp-soft">{lastResult.expected}</span> (
                {lastResult.expectedName ??
                  ACCOUNTS.find((a) => a.code === lastResult.expected)?.name}
                )
              </span>
              {lastResult.nearMissTip && (
                <span className="mt-1.5 block text-xs text-stamp-soft/90">{lastResult.nearMissTip}</span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

interface AccountHintsProps {
  onSelectCode: (code: string) => void
  variant?: "sidebar" | "mobile"
  className?: string
}

export function AccountHints({
  onSelectCode,
  variant = "sidebar",
  className = "",
}: AccountHintsProps) {
  const accountsByCategory = ACCOUNTS.reduce(
    (acc, account) => {
      if (!acc[account.category]) acc[account.category] = []
      acc[account.category].push(account)
      return acc
    },
    {} as Record<string, typeof ACCOUNTS>
  )

  return (
    <div
      className={`flex flex-col rounded-xl bg-ink p-4 text-paper-bright shadow-lg ${
        variant === "sidebar" ? "h-full min-h-0" : ""
      } ${className}`}
    >
      <p className="mb-2 shrink-0 text-[11px] uppercase tracking-[0.14em] text-paper-bright/40">
        Kontooversikt (NS 4102)
      </p>
      <p className="mb-3 shrink-0 text-[11px] text-paper-bright/35">
        Klikk en kode for å fylle inn
      </p>
      <div
        className={`min-h-0 space-y-3 overflow-y-auto text-xs ${
          variant === "mobile" ? "max-h-72" : "flex-1"
        }`}
      >
        {Object.entries(accountsByCategory).map(([category, accounts]) => (
          <div key={category}>
            <p className="mb-1.5 font-semibold text-paper-bright/55">{category}</p>
            <div className="space-y-0.5 pl-0.5">
              {accounts.map((account) => (
                <button
                  key={account.code}
                  type="button"
                  onClick={() => onSelectCode(account.code)}
                  className="flex w-full items-center gap-2 rounded-md px-1.5 py-1 text-left transition-colors hover:bg-paper-bright/10"
                >
                  <span className="shrink-0 font-mono text-stamp-soft">{account.code}</span>
                  <span className="truncate text-paper-bright/50">{account.name}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/** @deprecated Use AccountInput + AccountHints */
export function AccountPanel(
  props: AccountInputProps & { showHints?: boolean; onSelectCode?: (code: string) => void }
) {
  return (
    <div className="space-y-3">
      <AccountInput {...props} />
      {props.showHints && (
        <AccountHints
          variant="mobile"
          onSelectCode={props.onSelectCode ?? ((code) => props.onInputChange(code))}
        />
      )}
    </div>
  )
}
