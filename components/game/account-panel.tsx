"use client"

import { ACCOUNTS } from "@/lib/accounting-data"

interface AccountPanelProps {
  inputValue: string
  onInputChange: (value: string) => void
  onSubmit: () => void
  lastResult: { correct: boolean; account: string; expected: string } | null
  showHints: boolean
}

export function AccountPanel({
  inputValue,
  onInputChange,
  onSubmit,
  lastResult,
  showHints,
}: AccountPanelProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSubmit()
    }
  }

  const accountsByCategory = ACCOUNTS.reduce(
    (acc, account) => {
      if (!acc[account.category]) acc[account.category] = []
      acc[account.category].push(account)
      return acc
    },
    {} as Record<string, typeof ACCOUNTS>
  )

  return (
    <div className="rounded-xl bg-ink p-4 text-paper-bright shadow-lg">
      <div className="mb-4">
        <label className="mb-2 block text-[11px] uppercase tracking-[0.14em] text-paper-bright/45">
          Kontokode
        </label>
        <div className="flex gap-2">
          <input
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
            Bokfør
          </button>
        </div>

        {lastResult && (
          <div
            className={`mt-2 rounded-lg p-3 text-sm font-medium ${
              lastResult.correct
                ? "border border-moss/40 bg-moss/20 text-moss-bright"
                : "border border-danger/40 bg-danger/20 text-red-200"
            }`}
          >
            {lastResult.correct ? (
              <span>Riktig! Konto {lastResult.account}</span>
            ) : (
              <div>
                <span className="block font-bold text-red-100">−1 liv — feil kontokode</span>
                <span className="mt-1 block text-paper-bright/80">
                  Du skrev: <span className="font-mono">{lastResult.account}</span>
                  {" · "}
                  Riktig:{" "}
                  <span className="font-mono text-stamp-soft">{lastResult.expected}</span> (
                  {ACCOUNTS.find((a) => a.code === lastResult.expected)?.name})
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {showHints && (
        <div className="border-t border-paper-bright/10 pt-3">
          <p className="mb-2 text-[11px] uppercase tracking-[0.14em] text-paper-bright/40">
            Kontooversikt (NS 4102)
          </p>
          <div className="grid max-h-44 grid-cols-2 gap-x-4 gap-y-1 overflow-y-auto text-xs">
            {Object.entries(accountsByCategory).map(([category, accounts]) => (
              <div key={category} className="col-span-2 mb-2">
                <p className="mb-1 font-semibold text-paper-bright/55">{category}</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 pl-1">
                  {accounts.map((account) => (
                    <div key={account.code} className="flex gap-2">
                      <span className="font-mono text-stamp-soft">{account.code}</span>
                      <span className="truncate text-paper-bright/50">{account.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
