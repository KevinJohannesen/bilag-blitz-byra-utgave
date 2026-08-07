// Generell nordisk kontoplan basert på NS 4102 (firesiffernivå).
// Bevisst «byrå-generell»: kontoer de fleste nordiske regnskapsfolk kjenner,
// uten bransjespesifikke underkontoer.

export interface Account {
  code: string
  name: string
  category: string
  description: string
}

export const ACCOUNTS: Account[] = [
  // Klasse 1 – Eiendeler
  { code: "1200", name: "Maskiner og anlegg", category: "Eiendeler", description: "Varige driftsmidler" },
  { code: "1500", name: "Kundefordringer", category: "Eiendeler", description: "Utestående fra kunder" },
  { code: "1900", name: "Kontanter", category: "Eiendeler", description: "Kassebeholdning" },
  { code: "1920", name: "Bankinnskudd", category: "Eiendeler", description: "Bankkonto" },

  // Klasse 2 – Egenkapital og gjeld
  { code: "2000", name: "Aksjekapital", category: "Egenkapital", description: "Innskutt egenkapital" },
  { code: "2400", name: "Leverandørgjeld", category: "Gjeld", description: "Skyldig til leverandører" },
  { code: "2600", name: "Skattetrekk", category: "Gjeld", description: "Forskuddstrekk ansatte" },
  { code: "2701", name: "Utgående MVA", category: "MVA", description: "Skyldig merverdiavgift" },
  { code: "2711", name: "Inngående MVA", category: "MVA", description: "Fradragsberettiget MVA" },
  { code: "2770", name: "Skyldig arbeidsgiveravgift", category: "Gjeld", description: "AGA til innbetaling" },

  // Klasse 3 – Inntekter
  { code: "3000", name: "Salgsinntekt varer", category: "Inntekter", description: "Avgiftspliktig varesalg" },
  { code: "3100", name: "Salgsinntekt tjenester", category: "Inntekter", description: "Avgiftspliktig tjenestesalg" },

  // Klasse 4 – Varekostnad
  { code: "4000", name: "Varekostnad", category: "Varekostnad", description: "Kostnad solgte varer" },
  { code: "4300", name: "Innkjøp varer", category: "Varekostnad", description: "Innkjøp for videresalg" },

  // Klasse 5 – Lønnskostnader
  { code: "5000", name: "Lønn til ansatte", category: "Lønn", description: "Bruttolønn" },
  { code: "5400", name: "Arbeidsgiveravgift", category: "Lønn", description: "AGA-kostnad" },

  // Klasse 6 – Andre driftskostnader
  { code: "6000", name: "Avskrivninger", category: "Driftskostnad", description: "Avskrivning driftsmidler" },
  { code: "6300", name: "Leie lokaler", category: "Driftskostnad", description: "Husleie / kontorleie" },
  { code: "6500", name: "Verktøy og inventar", category: "Driftskostnad", description: "Utstyr som ikke aktiveres" },
  { code: "6700", name: "Regnskap og revisjon", category: "Driftskostnad", description: "Fremmede tjenester" },
  { code: "6800", name: "Kontorrekvisita", category: "Driftskostnad", description: "Rekvisita og forbruksmateriell" },
  { code: "6900", name: "Telefon og internett", category: "Driftskostnad", description: "Kommunikasjon" },

  // Klasse 7 – Andre kostnader
  { code: "7100", name: "Bilkostnader", category: "Driftskostnad", description: "Drivstoff, bom, parkering" },
  { code: "7350", name: "Reisekostnader", category: "Driftskostnad", description: "Reise, hotell, diett" },
  { code: "7500", name: "Forsikringspremie", category: "Driftskostnad", description: "Forsikringer" },
  { code: "7770", name: "Bank- og kortgebyrer", category: "Driftskostnad", description: "Gebyrer fra bank" },
]

export interface TransactionTemplate {
  description: string
  correctAccount: string
  amount: { min: number; max: number }
  keywords: string[]
}

export const TRANSACTION_TEMPLATES: TransactionTemplate[] = [
  // Bank / likviditet
  { description: "Innbetaling fra kunde på bank", correctAccount: "1920", amount: { min: 5000, max: 150000 }, keywords: ["bank", "innbetaling"] },
  { description: "Kontantuttak til kasse", correctAccount: "1900", amount: { min: 1000, max: 10000 }, keywords: ["kontant", "kasse"] },

  // Kundefordringer / leverandør
  { description: "Salgsfaktura sendt til kunde", correctAccount: "1500", amount: { min: 10000, max: 500000 }, keywords: ["faktura", "kunde"] },
  { description: "Leverandørfaktura mottatt", correctAccount: "2400", amount: { min: 5000, max: 200000 }, keywords: ["faktura", "leverandør"] },

  // MVA
  { description: "Utgående MVA på salg", correctAccount: "2701", amount: { min: 2500, max: 125000 }, keywords: ["mva", "utgående"] },
  { description: "Inngående MVA på kjøp", correctAccount: "2711", amount: { min: 500, max: 50000 }, keywords: ["mva", "inngående"] },

  // Lønn / trekk
  { description: "Forskuddstrekk skatt ansatte", correctAccount: "2600", amount: { min: 8000, max: 45000 }, keywords: ["skatt", "trekk"] },
  { description: "Skyldig arbeidsgiveravgift periodisert", correctAccount: "2770", amount: { min: 4000, max: 25000 }, keywords: ["aga", "skyldig"] },

  // Inntekter
  { description: "Salg av handelsvarer", correctAccount: "3000", amount: { min: 10000, max: 500000 }, keywords: ["salg", "varer"] },
  { description: "Konsulentoppdrag fakturert", correctAccount: "3100", amount: { min: 15000, max: 200000 }, keywords: ["tjeneste", "konsulent"] },

  // Varekostnad
  { description: "Varekostnad solgte varer", correctAccount: "4000", amount: { min: 5000, max: 300000 }, keywords: ["varekostnad"] },
  { description: "Innkjøp av varer for videresalg", correctAccount: "4300", amount: { min: 2000, max: 100000 }, keywords: ["innkjøp", "varer"] },

  // Lønnskostnad
  { description: "Utbetaling av lønn til ansatte", correctAccount: "5000", amount: { min: 30000, max: 90000 }, keywords: ["lønn"] },
  { description: "Arbeidsgiveravgift kostnad", correctAccount: "5400", amount: { min: 4000, max: 20000 }, keywords: ["aga", "kostnad"] },

  // Driftskostnader – klassiske byrå-/kontor-bilag
  { description: "Husleie for kontorlokaler", correctAccount: "6300", amount: { min: 8000, max: 55000 }, keywords: ["leie", "husleie"] },
  { description: "Kjøp av kontorstol (ikke aktivert)", correctAccount: "6500", amount: { min: 2000, max: 15000 }, keywords: ["inventar", "stol"] },
  { description: "Faktura fra regnskapsfører", correctAccount: "6700", amount: { min: 3000, max: 25000 }, keywords: ["regnskap", "revisjon"] },
  { description: "Kontorrekvisita fra Clas Ohlson", correctAccount: "6800", amount: { min: 200, max: 4000 }, keywords: ["rekvisita"] },
  { description: "Mobil- og internettregning", correctAccount: "6900", amount: { min: 400, max: 3500 }, keywords: ["telefon", "internett"] },
  { description: "Drivstoff og bompenger", correctAccount: "7100", amount: { min: 300, max: 4000 }, keywords: ["bil", "drivstoff"] },
  { description: "Flybilletter til kundemøte", correctAccount: "7350", amount: { min: 1500, max: 18000 }, keywords: ["reise", "fly"] },
  { description: "Bedriftsforsikring kvartalspremie", correctAccount: "7500", amount: { min: 4000, max: 45000 }, keywords: ["forsikring"] },
  { description: "Gebyr for bedriftskonto", correctAccount: "7770", amount: { min: 99, max: 1200 }, keywords: ["gebyr", "bank"] },

  // Aktivering / avskrivning
  { description: "Kjøp av produksjonsmaskin", correctAccount: "1200", amount: { min: 50000, max: 500000 }, keywords: ["maskin", "aktivering"] },
  { description: "Månedlig avskrivning maskiner", correctAccount: "6000", amount: { min: 2000, max: 40000 }, keywords: ["avskrivning"] },
  { description: "Innbetaling av aksjekapital", correctAccount: "2000", amount: { min: 30000, max: 100000 }, keywords: ["aksjekapital"] },
]

const COMPANY_PREFIXES = [
  "Nordic", "Fjord", "Bergen", "Oslo", "Trøndelag", "Vestland", "Polar", "Aurora", "Stavanger", "Troms",
]
const COMPANY_SUFFIXES = [
  "Consulting AS", "Regnskap AS", "Service AS", "Digital AS", "Bygg AS", "Handel AS", "Partner AS", "Group AS",
]

export function generateCompanyName(): string {
  const prefix = COMPANY_PREFIXES[Math.floor(Math.random() * COMPANY_PREFIXES.length)]
  const suffix = COMPANY_SUFFIXES[Math.floor(Math.random() * COMPANY_SUFFIXES.length)]
  return `${prefix} ${suffix}`
}

export interface Transaction {
  id: string
  description: string
  amount: number
  correctAccount: string
  accountName: string
  company: string
  date: string
}

export function generateTransaction(): Transaction {
  const template = TRANSACTION_TEMPLATES[Math.floor(Math.random() * TRANSACTION_TEMPLATES.length)]
  const account = ACCOUNTS.find(a => a.code === template.correctAccount)!
  const amount = Math.floor(Math.random() * (template.amount.max - template.amount.min) + template.amount.min)

  const date = new Date()
  date.setDate(date.getDate() - Math.floor(Math.random() * 30))

  return {
    id: crypto.randomUUID(),
    description: template.description,
    amount,
    correctAccount: template.correctAccount,
    accountName: account.name,
    company: generateCompanyName(),
    date: date.toLocaleDateString("nb-NO"),
  }
}

export function getAccountHint(code: string): string {
  const account = ACCOUNTS.find(a => a.code === code)
  if (!account) return ""
  return `${account.category}: ${account.description}`
}

export interface DifficultySettings {
  fallSpeed: number
  spawnInterval: number
  lives: number
  pointsPerCorrect: number
  bonusTimeThreshold: number
}

export const DIFFICULTY_LEVELS: Record<string, DifficultySettings> = {
  easy: {
    fallSpeed: 0.5,
    spawnInterval: 5000,
    lives: 5,
    pointsPerCorrect: 100,
    bonusTimeThreshold: 8,
  },
  medium: {
    fallSpeed: 0.8,
    spawnInterval: 3500,
    lives: 4,
    pointsPerCorrect: 150,
    bonusTimeThreshold: 6,
  },
  hard: {
    fallSpeed: 1.2,
    spawnInterval: 2500,
    lives: 3,
    pointsPerCorrect: 200,
    bonusTimeThreshold: 4,
  },
  expert: {
    fallSpeed: 1.6,
    spawnInterval: 2000,
    lives: 2,
    pointsPerCorrect: 300,
    bonusTimeThreshold: 3,
  },
}

export const DIFFICULTY_LABELS: Record<string, string> = {
  easy: "Lett",
  medium: "Medium",
  hard: "Vanskelig",
  expert: "Ekspert",
}

/** Horisontale spawn-baner (%) for å unngå overlappende bilag. */
export const SPAWN_LANES = [22, 50, 78] as const
