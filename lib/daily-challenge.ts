import {
  ACCOUNTS,
  getTemplatesForDifficulty,
  pickCompanyName,
  type Transaction,
  type TransactionTemplate,
} from "@/lib/accounting-data"

/** Antall bilag i dagens utfordring (fast lengde uansett vanskelighetsgrad). */
export const DAILY_TRANSACTION_COUNT = 15

export const DAILY_TIMEZONE = "Europe/Oslo"

/** Mulberry32 — liten, deterministisk PRNG fra 32-bit seed. */
export function createSeededRng(seed: number): () => number {
  let t = seed >>> 0
  return () => {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

/** Hash en streng til unsigned 32-bit (FNV-1a-ish). */
export function hashStringToSeed(input: string): number {
  let h = 2166136261
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/**
 * Dagens dato i Norge (YYYY-MM-DD).
 * Bruker enstable Intl-parts for å unngå server/klient-skew rundt midnatt UTC.
 */
export function getOsloDateString(now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: DAILY_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now)

  const year = parts.find((p) => p.type === "year")?.value
  const month = parts.find((p) => p.type === "month")?.value
  const day = parts.find((p) => p.type === "day")?.value
  if (!year || !month || !day) {
    throw new Error("Kunne ikke beregne Oslo-dato")
  }
  return `${year}-${month}-${day}`
}

export function isValidChallengeDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [y, m, d] = value.split("-").map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d))
  return (
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() === m - 1 &&
    dt.getUTCDate() === d
  )
}

/** Seed for en gitt kalenderdag (Oslo) + vanskelighetsgrad. */
export function getDailySeed(date: string = getOsloDateString(), difficulty = "medium"): number {
  return hashStringToSeed(`bilag-blitz-daily:${date}:${difficulty}`)
}

function formatNbDate(year: number, month: number, day: number): string {
  return `${day}.${month}.${year}`
}

function shuffleInPlace<T>(items: T[], rng: () => number): T[] {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    const tmp = items[i]
    items[i] = items[j]
    items[j] = tmp
  }
  return items
}

function pickTemplates(pool: TransactionTemplate[], count: number, rng: () => number): TransactionTemplate[] {
  if (pool.length === 0) return []
  const picked: TransactionTemplate[] = []
  let deck = shuffleInPlace([...pool], rng)
  let cursor = 0
  while (picked.length < count) {
    if (cursor >= deck.length) {
      deck = shuffleInPlace([...pool], rng)
      cursor = 0
    }
    picked.push(deck[cursor])
    cursor += 1
  }
  return picked
}

function materializeDailyTransaction(
  template: TransactionTemplate,
  index: number,
  date: string,
  rng: () => number
): Transaction {
  const account = ACCOUNTS.find((a) => a.code === template.correctAccount)
  if (!account) {
    throw new Error(`Ukjent konto ${template.correctAccount}`)
  }

  const amountSpan = template.amount.max - template.amount.min
  const amount = Math.floor(rng() * amountSpan) + template.amount.min

  const [y, m, d] = date.split("-").map(Number)
  const offsetDays = Math.floor(rng() * 30)
  const bilag = new Date(Date.UTC(y, m - 1, d))
  bilag.setUTCDate(bilag.getUTCDate() - offsetDays)

  return {
    id: `daily-${date}-${index}`,
    description: template.description,
    amount,
    correctAccount: template.correctAccount,
    accountName: account.name,
    company: pickCompanyName(template.companyTag, rng),
    date: formatNbDate(bilag.getUTCFullYear(), bilag.getUTCMonth() + 1, bilag.getUTCDate()),
    explain: template.explain,
    keywords: template.keywords,
  }
}

/**
 * Fast, deterministisk bilagliste for dagens utfordring.
 * Samme dato + vanskelighetsgrad ⇒ samme rekkefølge for alle spillere.
 */
export function getDailyTransactions(
  difficulty: string = "medium",
  date: string = getOsloDateString()
): Transaction[] {
  const seed = getDailySeed(date, difficulty)
  const rng = createSeededRng(seed)
  const pool = getTemplatesForDifficulty(difficulty)
  const templates = pickTemplates(pool, DAILY_TRANSACTION_COUNT, rng)
  return templates.map((template, index) =>
    materializeDailyTransaction(template, index, date, rng)
  )
}

/** Klarte dagens løp: alle bilag spawnet og minst ett liv igjen. */
export function didClearDaily(params: {
  spawnedCount: number
  livesRemaining: number
  total: number
}): boolean {
  return params.spawnedCount >= params.total && params.livesRemaining > 0
}
