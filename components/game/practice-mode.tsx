"use client"

import { useMemo, useState } from "react"
import { AccountHints, AccountInput, type LastResult } from "./account-panel"
import {
  ACCOUNT_CLASS_FILTERS,
  ACCOUNTS,
  TRANSACTION_TEMPLATES,
  generateCompanyName,
  type Transaction,
} from "@/lib/accounting-data"
import { loadFeilbok, type FeilbokEntry } from "@/lib/feilbok"

type PracticeFilter = "all" | "mistakes" | string

interface PracticeModeProps {
  onExit: () => void
  showHints: boolean
}

function buildFromTemplate(description: string): Transaction | null {
  const template = TRANSACTION_TEMPLATES.find((t) => t.description === description)
  if (!template) return null
  const account = ACCOUNTS.find((a) => a.code === template.correctAccount)
  if (!account) return null
  const amount = Math.floor(
    Math.random() * (template.amount.max - template.amount.min) + template.amount.min
  )
  const date = new Date()
  date.setDate(date.getDate() - Math.floor(Math.random() * 30))
  return {
    id: crypto.randomUUID(),
    description: template.description,
    amount,
    correctAccount: template.correctAccount,
    accountName: account.name,
    company: generateCompanyName(template.companyTag),
    date: date.toLocaleDateString("nb-NO"),
    explain: template.explain,
    keywords: template.keywords,
  }
}

function buildFromFeil(entry: FeilbokEntry): Transaction {
  const template = TRANSACTION_TEMPLATES.find((t) => t.description === entry.description)
  const amount = template
    ? Math.floor(Math.random() * (template.amount.max - template.amount.min) + template.amount.min)
    : 1000 + Math.floor(Math.random() * 9000)
  return {
    id: crypto.randomUUID(),
    description: entry.description,
    amount,
    correctAccount: entry.correctAccount,
    accountName: entry.accountName,
    company: generateCompanyName(template?.companyTag ?? "kontor"),
    date: new Date().toLocaleDateString("nb-NO"),
    explain: entry.explain ?? template?.explain ?? "Øv på denne kontokoden.",
    keywords: template?.keywords ?? [],
  }
}

function pickNext(filter: PracticeFilter, feilbok: FeilbokEntry[]): Transaction | null {
  if (filter === "mistakes") {
    if (feilbok.length === 0) return null
    const entry = feilbok[Math.floor(Math.random() * feilbok.length)]
    return buildFromFeil(entry)
  }

  let pool = TRANSACTION_TEMPLATES
  if (filter !== "all") {
    pool = pool.filter((t) => t.correctAccount.startsWith(filter))
  }
  if (pool.length === 0) return null
  const template = pool[Math.floor(Math.random() * pool.length)]
  return buildFromTemplate(template.description)
}

export function PracticeMode({ onExit, showHints }: PracticeModeProps) {
  const feilbok = useMemo(() => loadFeilbok(), [])
  const [filter, setFilter] = useState<PracticeFilter>(feilbok.length > 0 ? "mistakes" : "all")
  const [current, setCurrent] = useState<Transaction | null>(() =>
    pickNext(feilbok.length > 0 ? "mistakes" : "all", feilbok)
  )
  const [inputValue, setInputValue] = useState("")
  const [focusToken, setFocusToken] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [lastResult, setLastResult] = useState<LastResult | null>(null)
  const [stats, setStats] = useState({ correct: 0, attempts: 0 })

  const loadNext = (nextFilter: PracticeFilter = filter) => {
    setInputValue("")
    setRevealed(false)
    setLastResult(null)
    setCurrent(pickNext(nextFilter, feilbok))
    setFocusToken((t) => t + 1)
  }

  const changeFilter = (next: PracticeFilter) => {
    setFilter(next)
    loadNext(next)
  }

  const handleSubmit = () => {
    if (!current || !inputValue || revealed) return
    const isCorrect = inputValue === current.correctAccount
    setStats((s) => ({
      correct: s.correct + (isCorrect ? 1 : 0),
      attempts: s.attempts + 1,
    }))
    setLastResult({
      correct: isCorrect,
      account: inputValue,
      expected: current.correctAccount,
      expectedName: current.accountName,
      reason: "wrong",
    })
    setRevealed(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-stamp">Øvingsmodus</p>
          <h2 className="font-display text-2xl font-bold text-ink">Lær uten tidspress</h2>
        </div>
        <button
          type="button"
          onClick={onExit}
          className="rounded-lg bg-ledger px-4 py-2 text-sm font-medium text-ink hover:bg-muted"
        >
          Tilbake til meny
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {ACCOUNT_CLASS_FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => changeFilter(item.digit ?? "all")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === (item.digit ?? "all")
                ? "bg-moss text-primary-foreground"
                : "bg-ledger text-ink/70 hover:bg-muted"
            }`}
          >
            {item.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => changeFilter("mistakes")}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            filter === "mistakes"
              ? "bg-stamp text-accent-foreground"
              : "bg-ledger text-ink/70 hover:bg-muted"
          }`}
        >
          Mine feil ({feilbok.length})
        </button>
      </div>

      <p className="text-sm text-ink/55">
        Riktig denne økten:{" "}
        <span className="font-mono font-semibold text-moss">
          {stats.correct}/{stats.attempts}
        </span>
      </p>

      {!current ? (
        <div className="rounded-2xl border border-ink/10 bg-paper-bright p-8 text-center">
          <p className="font-display text-xl font-bold text-ink">Ingen bilag i dette filteret</p>
          <p className="mt-2 text-sm text-ink/60">
            {filter === "mistakes"
              ? "Spill en Blitz-runde først — feilene dine dukker opp her."
              : "Prøv et annet filter."}
          </p>
        </div>
      ) : (
        <div className={`grid gap-3 ${showHints ? "md:grid-cols-[1fr_280px]" : ""}`}>
          <div className="space-y-3">
            <div className="receipt-paper animate-brand-rise rounded-2xl border border-ink/10 p-6 shadow-[0_16px_40px_rgba(15,31,28,0.1)]">
              <p className="font-mono text-[11px] tracking-wide text-ink/45">{current.date}</p>
              <p className="mt-1 font-semibold text-ink">{current.company}</p>
              <p className="mt-4 text-lg leading-snug text-ink/80">{current.description}</p>
              <div className="mt-4 flex items-center justify-between border-t border-dashed border-ink/15 pt-3">
                <span className="text-[11px] uppercase tracking-wider text-ink/45">Beløp</span>
                <span className="font-mono text-xl font-semibold text-ink">
                  kr {current.amount.toLocaleString("nb-NO")}
                </span>
              </div>
            </div>

            <AccountInput
              inputValue={inputValue}
              onInputChange={setInputValue}
              onSubmit={handleSubmit}
              lastResult={revealed ? lastResult : null}
              focusToken={focusToken}
              submitLabel={revealed ? "Svar vist" : "Sjekk svar"}
              activeHint={{ description: current.description, company: current.company }}
            />

            {revealed && (
              <div className="animate-result-pop rounded-xl border border-moss/25 bg-moss/5 p-5">
                <p className="text-[11px] uppercase tracking-[0.14em] text-moss">Forklaring</p>
                <p className="mt-2 font-mono text-lg font-bold text-ink">
                  {current.correctAccount}{" "}
                  <span className="font-sans font-semibold">{current.accountName}</span>
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{current.explain}</p>
                <button
                  type="button"
                  onClick={() => loadNext()}
                  className="mt-4 rounded-xl bg-moss px-6 py-3 font-display font-bold text-primary-foreground hover:bg-moss-bright"
                >
                  Neste bilag
                </button>
              </div>
            )}
          </div>

          {showHints && (
            <div className="hidden md:block">
              <AccountHints
                variant="sidebar"
                className="min-h-[420px]"
                onSelectCode={(code) => {
                  setInputValue(code)
                  setFocusToken((t) => t + 1)
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
