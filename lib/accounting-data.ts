// Generell nordisk kontoplan basert på NS 4102 (firesiffernivå).
// Bevisst «byrå-generell»: kontoer de fleste nordiske regnskapsfolk kjenner,
// uten bransjespesifikke underkontoer.

export type DifficultyTier = "easy" | "medium" | "hard" | "expert"

export type CompanyTag = "handel" | "konsulent" | "kontor" | "produksjon" | "bank"

export interface Account {
  code: string
  name: string
  category: string
  description: string
}

export const ACCOUNTS: Account[] = [
  // Klasse 1 – Eiendeler
  { code: "1200", name: "Maskiner og anlegg", category: "Eiendeler", description: "Varige driftsmidler" },
  { code: "1400", name: "Varelager", category: "Eiendeler", description: "Handelsvarer på lager" },
  { code: "1500", name: "Kundefordringer", category: "Eiendeler", description: "Utestående fra kunder" },
  { code: "1570", name: "Andre kortsiktige fordringer", category: "Eiendeler", description: "Mellomværende / diverse fordringer" },
  { code: "1700", name: "Forskuddsbetalte kostnader", category: "Eiendeler", description: "Periodisering forskudd" },
  { code: "1900", name: "Kontanter", category: "Eiendeler", description: "Kassebeholdning" },
  { code: "1920", name: "Bankinnskudd", category: "Eiendeler", description: "Bankkonto" },

  // Klasse 2 – Egenkapital og gjeld
  { code: "2000", name: "Aksjekapital", category: "Egenkapital", description: "Innskutt egenkapital" },
  { code: "2050", name: "Annen egenkapital", category: "Egenkapital", description: "Opptjent / annen EK" },
  { code: "2400", name: "Leverandørgjeld", category: "Gjeld", description: "Skyldig til leverandører" },
  { code: "2600", name: "Skattetrekk", category: "Gjeld", description: "Forskuddstrekk ansatte" },
  { code: "2701", name: "Utgående MVA", category: "MVA", description: "Skyldig merverdiavgift" },
  { code: "2711", name: "Inngående MVA", category: "MVA", description: "Fradragsberettiget MVA" },
  { code: "2740", name: "Oppgjørskonto MVA", category: "MVA", description: "MVA til innbetaling / tilgode" },
  { code: "2770", name: "Skyldig arbeidsgiveravgift", category: "Gjeld", description: "AGA til innbetaling" },
  { code: "2900", name: "Påløpte kostnader", category: "Gjeld", description: "Periodisering skyldig kostnad" },

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
  { code: "6340", name: "Lys og varme", category: "Driftskostnad", description: "Strøm og energi" },
  { code: "6500", name: "Verktøy og inventar", category: "Driftskostnad", description: "Utstyr som ikke aktiveres" },
  { code: "6540", name: "Inventar under aktiveringsgrense", category: "Driftskostnad", description: "Småanskaffelser" },
  { code: "6700", name: "Regnskap og revisjon", category: "Driftskostnad", description: "Fremmede tjenester" },
  { code: "6780", name: "Faglitteratur og programvare", category: "Driftskostnad", description: "SaaS / lisenser / fagstoff" },
  { code: "6800", name: "Kontorrekvisita", category: "Driftskostnad", description: "Rekvisita og forbruksmateriell" },
  { code: "6900", name: "Telefon og internett", category: "Driftskostnad", description: "Kommunikasjon" },

  // Klasse 7 – Andre kostnader
  { code: "7100", name: "Bilkostnader", category: "Driftskostnad", description: "Drivstoff, bom, parkering" },
  { code: "7300", name: "Salgs- og reklamekostnader", category: "Driftskostnad", description: "Annonsering og markedsføring" },
  { code: "7350", name: "Reisekostnader", category: "Driftskostnad", description: "Reise, hotell, diett" },
  { code: "7360", name: "Representasjon", category: "Driftskostnad", description: "Representasjonskostnader" },
  { code: "7500", name: "Forsikringspremie", category: "Driftskostnad", description: "Forsikringer" },
  { code: "7770", name: "Bank- og kortgebyrer", category: "Driftskostnad", description: "Gebyrer fra bank" },

  // Klasse 8 – Finans
  { code: "8050", name: "Annen renteinntekt", category: "Finans", description: "Renteinntekter" },
  { code: "8150", name: "Annen rentekostnad", category: "Finans", description: "Rentekostnader" },
]

export interface TransactionTemplate {
  description: string
  correctAccount: string
  amount: { min: number; max: number }
  keywords: string[]
  tier: DifficultyTier
  companyTag: CompanyTag
  /** Kort forklaring (øving / feilbok), maks ca. 120 tegn */
  explain: string
}

const TIER_RANK: Record<DifficultyTier, number> = {
  easy: 0,
  medium: 1,
  hard: 2,
  expert: 3,
}

export function tierAllows(templateTier: DifficultyTier, selected: string): boolean {
  const selectedTier = (selected in TIER_RANK ? selected : "medium") as DifficultyTier
  return TIER_RANK[templateTier] <= TIER_RANK[selectedTier]
}

export const TRANSACTION_TEMPLATES: TransactionTemplate[] = [
  // —— Lett: daglige kontorkostnader og enkle bankbevegelser ——
  {
    description: "Husleie for kontorlokaler",
    correctAccount: "6300",
    amount: { min: 8000, max: 55000 },
    keywords: ["leie", "husleie", "lokale"],
    tier: "easy",
    companyTag: "kontor",
    explain: "Leie av kontor/lokaler kostnadsføres på leiekonto — ikke som leverandørgjeld alene.",
  },
  {
    description: "Strømregning for kontoret",
    correctAccount: "6340",
    amount: { min: 800, max: 12000 },
    keywords: ["strøm", "energi", "lys"],
    tier: "easy",
    companyTag: "kontor",
    explain: "Energi til drift er lys og varme — egen kostnadskonto under driftskostnader.",
  },
  {
    description: "Kjøp av kontorrekvisita i butikk",
    correctAccount: "6800",
    amount: { min: 200, max: 4000 },
    keywords: ["rekvisita", "papir", "kontor"],
    tier: "easy",
    companyTag: "kontor",
    explain: "Forbruksmateriell til kontoret bokføres som kontorrekvisita.",
  },
  {
    description: "Mobil- og internettregning",
    correctAccount: "6900",
    amount: { min: 400, max: 3500 },
    keywords: ["telefon", "internett", "mobil"],
    tier: "easy",
    companyTag: "kontor",
    explain: "Kommunikasjonstjenester hører hjemme på telefon og internett.",
  },
  {
    description: "Faktura fra regnskapsfører",
    correctAccount: "6700",
    amount: { min: 3000, max: 25000 },
    keywords: ["regnskap", "revisjon", "byrå"],
    tier: "easy",
    companyTag: "kontor",
    explain: "Honorar for regnskap/revisjon er fremmede tjenester — ikke lønn.",
  },
  {
    description: "Drivstoff og bompenger på firmabil",
    correctAccount: "7100",
    amount: { min: 300, max: 4000 },
    keywords: ["bil", "drivstoff", "bom"],
    tier: "easy",
    companyTag: "kontor",
    explain: "Drift av bil (drivstoff, bom, parkering) samles på bilkostnader.",
  },
  {
    description: "Gebyr trukket på bedriftskonto",
    correctAccount: "7770",
    amount: { min: 99, max: 1200 },
    keywords: ["gebyr", "bank", "kort"],
    tier: "easy",
    companyTag: "bank",
    explain: "Bank- og kortgebyr er en finans-/driftskostnad, ikke selve banksaldoen.",
  },
  {
    description: "Bedriftsforsikring kvartalspremie",
    correctAccount: "7500",
    amount: { min: 4000, max: 45000 },
    keywords: ["forsikring", "premie"],
    tier: "easy",
    companyTag: "kontor",
    explain: "Forsikringspremie kostnadsføres på forsikringskonto.",
  },
  {
    description: "Flybilletter til kundemøte",
    correctAccount: "7350",
    amount: { min: 1500, max: 18000 },
    keywords: ["reise", "fly", "hotell"],
    tier: "easy",
    companyTag: "konsulent",
    explain: "Reise i tjeneste (fly, hotell, diett) bokføres som reisekostnader.",
  },
  {
    description: "Annonse på Facebook og Google",
    correctAccount: "7300",
    amount: { min: 500, max: 25000 },
    keywords: ["annonse", "reklame", "markedsføring"],
    tier: "easy",
    companyTag: "handel",
    explain: "Markedsføring og reklame er salgs- og reklamekostnader.",
  },
  {
    description: "Abonnement på regnskapsprogram (SaaS)",
    correctAccount: "6780",
    amount: { min: 299, max: 8000 },
    keywords: ["saas", "programvare", "lisens"],
    tier: "easy",
    companyTag: "kontor",
    explain: "Programvarelisenser og fagverktøy føres som faglitteratur/programvare.",
  },
  {
    description: "Kundens betaling inn på bankkonto",
    correctAccount: "1920",
    amount: { min: 5000, max: 150000 },
    keywords: ["bank", "innbetaling", "likviditet"],
    tier: "easy",
    companyTag: "bank",
    explain: "Pengene lander på bank — primærkonto her er bankinnskudd (ikke fordringen).",
  },
  {
    description: "Kontantuttak fra bank til kasse",
    correctAccount: "1900",
    amount: { min: 1000, max: 10000 },
    keywords: ["kontant", "kasse", "uttak"],
    tier: "easy",
    companyTag: "bank",
    explain: "Når kontanter hentes til kasse, øker kassebeholdningen (1900).",
  },

  // —— Medium: inntekter, enkle balanseposter, vanlige kostnader ——
  {
    description: "Salgsinntekt ved varesalg (netto)",
    correctAccount: "3000",
    amount: { min: 10000, max: 500000 },
    keywords: ["salg", "varer", "inntekt"],
    tier: "medium",
    companyTag: "handel",
    explain: "Selve inntekten fra varesalg føres på salgsinntekt varer — ikke på fordring.",
  },
  {
    description: "Salgsinntekt fra konsulentoppdrag (netto)",
    correctAccount: "3100",
    amount: { min: 15000, max: 200000 },
    keywords: ["tjeneste", "konsulent", "inntekt"],
    tier: "medium",
    companyTag: "konsulent",
    explain: "Tjenestesalg bokføres som salgsinntekt tjenester.",
  },
  {
    description: "Kundefordring ved utstedt salgsfaktura",
    correctAccount: "1500",
    amount: { min: 10000, max: 500000 },
    keywords: ["fordring", "faktura", "kunde"],
    tier: "medium",
    companyTag: "handel",
    explain: "Når faktura sendes, oppstår kundefordring — inntekten er en annen konto.",
  },
  {
    description: "Leverandørgjeld ved mottatt leverandørfaktura",
    correctAccount: "2400",
    amount: { min: 5000, max: 200000 },
    keywords: ["leverandør", "gjeld", "faktura"],
    tier: "medium",
    companyTag: "kontor",
    explain: "Mottatt faktura skaper leverandørgjeld; kostnadskontoen velges ut fra hva som er kjøpt.",
  },
  {
    description: "Innkjøp av varer for videresalg",
    correctAccount: "4300",
    amount: { min: 2000, max: 100000 },
    keywords: ["innkjøp", "varer", "handel"],
    tier: "medium",
    companyTag: "handel",
    explain: "Innkjøp til videresalg føres som innkjøp varer (skilt fra vareforbruk/COGS).",
  },
  {
    description: "Vareforbruk / kostnad solgte varer",
    correctAccount: "4000",
    amount: { min: 5000, max: 300000 },
    keywords: ["varekostnad", "cogs", "forbruk"],
    tier: "medium",
    companyTag: "handel",
    explain: "Når varer selges, kostnadsføres lageret som varekostnad — ikke innkjøpskontoen.",
  },
  {
    description: "Bruttolønn periodisert for ansatte",
    correctAccount: "5000",
    amount: { min: 30000, max: 90000 },
    keywords: ["lønn", "brutto", "ansatt"],
    tier: "medium",
    companyTag: "kontor",
    explain: "Lønnskostnaden er bruttolønn — ikke bankutbetalingen eller skattetrekket.",
  },
  {
    description: "Arbeidsgiveravgift som kostnad",
    correctAccount: "5400",
    amount: { min: 4000, max: 20000 },
    keywords: ["aga", "kostnad", "arbeidsgiver"],
    tier: "medium",
    companyTag: "kontor",
    explain: "AGA-kostnaden (5400) er resultatkonto; skyldig AGA er balanse (2770).",
  },
  {
    description: "Kjøp av kontorstol under aktiveringsgrense",
    correctAccount: "6500",
    amount: { min: 2000, max: 15000 },
    keywords: ["inventar", "stol", "utstyr"],
    tier: "medium",
    companyTag: "kontor",
    explain: "Utstyr som ikke aktiveres kostnadsføres — ikke maskiner/anlegg.",
  },
  {
    description: "Middag med kunde (representasjon)",
    correctAccount: "7360",
    amount: { min: 800, max: 12000 },
    keywords: ["representasjon", "middag", "kunde"],
    tier: "medium",
    companyTag: "konsulent",
    explain: "Representasjon har egen konto — ikke vanlig reise eller reklame.",
  },
  {
    description: "Småanskaffelse PC-skjerm (ikke aktivert)",
    correctAccount: "6540",
    amount: { min: 1500, max: 12000 },
    keywords: ["inventar", "skjerm", "småanskaffelse"],
    tier: "medium",
    companyTag: "kontor",
    explain: "Kjøp under aktiveringsgrense føres som inventar under aktiveringsgrense.",
  },
  {
    description: "Bankbetaling til leverandør",
    correctAccount: "1920",
    amount: { min: 3000, max: 180000 },
    keywords: ["bank", "betaling", "leverandør"],
    tier: "medium",
    companyTag: "bank",
    explain: "Selve utbetalingen treffer bank; leverandørgjelden reduseres i bilaget for øvrig.",
  },

  // —— Hard: MVA, trekk, aktivering, periodisering ——
  {
    description: "MVA-delen utgående på salgsfaktura",
    correctAccount: "2701",
    amount: { min: 2500, max: 125000 },
    keywords: ["mva", "utgående", "salg"],
    tier: "hard",
    companyTag: "handel",
    explain: "Utgående MVA er skyldig merverdiavgift på salget — ikke salgsinntekten.",
  },
  {
    description: "MVA-delen inngående på kjøpsfaktura",
    correctAccount: "2711",
    amount: { min: 500, max: 50000 },
    keywords: ["mva", "inngående", "fradrag"],
    tier: "hard",
    companyTag: "kontor",
    explain: "Inngående MVA er fradragsberettiget MVA på kjøp — ikke kostnadskontoen.",
  },
  {
    description: "Forskuddstrekk skatt trukket av lønn",
    correctAccount: "2600",
    amount: { min: 8000, max: 45000 },
    keywords: ["skatt", "trekk", "forskudd"],
    tier: "hard",
    companyTag: "kontor",
    explain: "Skattetrekk er gjeld til staten — ikke lønnskostnad eller bank.",
  },
  {
    description: "Skyldig arbeidsgiveravgift periodisert",
    correctAccount: "2770",
    amount: { min: 4000, max: 25000 },
    keywords: ["aga", "skyldig", "gjeld"],
    tier: "hard",
    companyTag: "kontor",
    explain: "Balansekonto for AGA som skal betales — kostnaden ligger på 5400.",
  },
  {
    description: "Kjøp av produksjonsmaskin til aktivering",
    correctAccount: "1200",
    amount: { min: 50000, max: 500000 },
    keywords: ["maskin", "aktivering", "driftsmiddel"],
    tier: "hard",
    companyTag: "produksjon",
    explain: "Varige driftsmidler aktiveres på maskiner og anlegg — ikke som kostnad.",
  },
  {
    description: "Månedlig avskrivning av maskiner",
    correctAccount: "6000",
    amount: { min: 2000, max: 40000 },
    keywords: ["avskrivning", "nedskrivning"],
    tier: "hard",
    companyTag: "produksjon",
    explain: "Avskrivning er kostnad for bruk av driftsmidlet over tid.",
  },
  {
    description: "Innskudd av aksjekapital i selskapet",
    correctAccount: "2000",
    amount: { min: 30000, max: 100000 },
    keywords: ["aksjekapital", "egenkapital"],
    tier: "hard",
    companyTag: "bank",
    explain: "Egenkapitaløkningen bokføres på aksjekapital (banken er motkonto).",
  },
  {
    description: "Forskuddsbetalt husleie for neste kvartal",
    correctAccount: "1700",
    amount: { min: 15000, max: 90000 },
    keywords: ["forskudd", "periodisering", "leie"],
    tier: "hard",
    companyTag: "kontor",
    explain: "Betalt på forskudd er eiendel til periodisering — ikke årets leiekostnad alene.",
  },
  {
    description: "Påløpt regnskapsbistand ikke fakturert ennå",
    correctAccount: "2900",
    amount: { min: 2000, max: 20000 },
    keywords: ["påløpt", "periodisering", "skyldig"],
    tier: "hard",
    companyTag: "kontor",
    explain: "Påløpte kostnader er gjeld når tjenesten er mottatt men ikke fakturert.",
  },
  {
    description: "Varelager ved vareopptelling",
    correctAccount: "1400",
    amount: { min: 20000, max: 400000 },
    keywords: ["lager", "varer", "beholdning"],
    tier: "hard",
    companyTag: "handel",
    explain: "Handelsvarer på lager er omløpsmiddel — skilt fra varekostnad ved salg.",
  },
  {
    description: "Renteinntekt på driftskonto",
    correctAccount: "8050",
    amount: { min: 50, max: 5000 },
    keywords: ["rente", "inntekt", "bank"],
    tier: "hard",
    companyTag: "bank",
    explain: "Renteinntekter er finansinntekt i klasse 8 — ikke driftsinntekt.",
  },
  {
    description: "Rentekostnad på kassekreditt",
    correctAccount: "8150",
    amount: { min: 200, max: 15000 },
    keywords: ["rente", "kostnad", "lån"],
    tier: "hard",
    companyTag: "bank",
    explain: "Rentekostnader er finanskostnad — ikke bankgebyr.",
  },

  // —— Ekspert: oppgjør, mellomværende, fine skillet ——
  {
    description: "MVA-oppgjør tilgodelagt / til betaling",
    correctAccount: "2740",
    amount: { min: 1000, max: 80000 },
    keywords: ["mva", "oppgjør", "termin"],
    tier: "expert",
    companyTag: "kontor",
    explain: "Oppgjørskonto MVA samler terminen — skilt fra 2701/2711-linjene.",
  },
  {
    description: "Bankinnbetaling av skyldig skattetrekk",
    correctAccount: "1920",
    amount: { min: 8000, max: 45000 },
    keywords: ["bank", "skattetrekk", "betaling"],
    tier: "expert",
    companyTag: "bank",
    explain: "Selve betalingen går over bank; trekkgjelden (2600) reduseres i bilaget.",
  },
  {
    description: "Mellomværende med eier (kortsiktig fordring)",
    correctAccount: "1570",
    amount: { min: 2000, max: 50000 },
    keywords: ["mellomværende", "eier", "fordring"],
    tier: "expert",
    companyTag: "kontor",
    explain: "Private mellomværende føres ofte som andre kortsiktige fordringer — ikke drift.",
  },
  {
    description: "Overføring til annen egenkapital",
    correctAccount: "2050",
    amount: { min: 10000, max: 200000 },
    keywords: ["egenkapital", "opptjent", "avsetning"],
    tier: "expert",
    companyTag: "kontor",
    explain: "Annen egenkapital er EK utover aksjekapital — ikke resultatkonto.",
  },
  {
    description: "Inngående MVA vs utgående — fradragsdelen på kjøp",
    correctAccount: "2711",
    amount: { min: 1000, max: 40000 },
    keywords: ["mva", "inngående", "fradrag"],
    tier: "expert",
    companyTag: "handel",
    explain: "På kjøp er det inngående MVA (2711) som er fradraget — ikke utgående (2701).",
  },
  {
    description: "Utgående MVA vs inngående — skyldig del på salg",
    correctAccount: "2701",
    amount: { min: 2000, max: 90000 },
    keywords: ["mva", "utgående", "skyldig"],
    tier: "expert",
    companyTag: "handel",
    explain: "På salg er det utgående MVA (2701) som skylder staten — ikke 2711.",
  },
  {
    description: "AGA kostnad vs skyldig — resultatføring av avgiften",
    correctAccount: "5400",
    amount: { min: 3000, max: 22000 },
    keywords: ["aga", "kostnad", "resultat"],
    tier: "expert",
    companyTag: "kontor",
    explain: "Når spørsmålet er kostnadseffekten, er det 5400 — ikke skyldig AGA 2770.",
  },
  {
    description: "Varekostnad vs innkjøp — forbruk ved salg",
    correctAccount: "4000",
    amount: { min: 8000, max: 250000 },
    keywords: ["varekostnad", "forbruk", "salg"],
    tier: "expert",
    companyTag: "handel",
    explain: "Forbruk ved salg er 4000; 4300 brukes når varene kjøpes inn.",
  },
]

const COMPANY_POOLS: Record<CompanyTag, string[]> = {
  handel: [
    "Fjord Handel AS",
    "Oslo Trading AS",
    "Nordic Retail AS",
    "Vestland Marked AS",
    "Aurora Butikk AS",
  ],
  konsulent: [
    "Bergen Consulting AS",
    "Polar Råd AS",
    "Trøndelag Advisory AS",
    "Nordic Partner AS",
    "Stavanger Digital AS",
  ],
  kontor: [
    "Oslo Regnskap AS",
    "Fjord Service AS",
    "Vestland Kontor AS",
    "Troms Admin AS",
    "Aurora Drift AS",
  ],
  produksjon: [
    "Trøndelag Industri AS",
    "Nordic Produksjon AS",
    "Bergen Maskin AS",
    "Vestland Verksted AS",
    "Polar Fabrication AS",
  ],
  bank: [
    "Fjord Finans AS",
    "Oslo Kapital AS",
    "Nordic Bankpartner AS",
    "Stavanger Holding AS",
    "Aurora Invest AS",
  ],
}

export function generateCompanyName(tag: CompanyTag = "kontor"): string {
  const pool = COMPANY_POOLS[tag]
  return pool[Math.floor(Math.random() * pool.length)]
}

export interface Transaction {
  id: string
  description: string
  amount: number
  correctAccount: string
  accountName: string
  company: string
  date: string
  explain: string
  keywords: string[]
}

export function getTemplatesForDifficulty(difficulty: string = "medium"): TransactionTemplate[] {
  const pool = TRANSACTION_TEMPLATES.filter((t) => tierAllows(t.tier, difficulty))
  return pool.length > 0 ? pool : TRANSACTION_TEMPLATES
}

export function generateTransaction(difficulty: string = "medium"): Transaction {
  const pool = getTemplatesForDifficulty(difficulty)
  const template = pool[Math.floor(Math.random() * pool.length)]
  const account = ACCOUNTS.find((a) => a.code === template.correctAccount)!
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

export function getAccountHint(code: string): string {
  const account = ACCOUNTS.find((a) => a.code === code)
  if (!account) return ""
  return `${account.category}: ${account.description}`
}

export function getSoftHint(tx: Pick<Transaction, "correctAccount" | "keywords">): string {
  const categoryHint = getAccountHint(tx.correctAccount)
  const keyword = tx.keywords[0]
  if (keyword && categoryHint) return `Tips: ${keyword} · ${categoryHint}`
  if (categoryHint) return `Tips: ${categoryHint}`
  return keyword ? `Tips: ${keyword}` : ""
}

/** Near-miss tip when player guessed same account class (first digit). */
export function getNearMissTip(guessed: string, expected: string): string | null {
  if (!/^\d{4}$/.test(guessed) || !/^\d{4}$/.test(expected)) return null
  if (guessed === expected) return null
  if (guessed[0] !== expected[0]) return null

  const expectedAccount = ACCOUNTS.find((a) => a.code === expected)
  const classDigit = expected[0]

  if (classDigit === "2" && (expected.startsWith("27") || guessed.startsWith("27"))) {
    return "Riktig klasse — sjekk om det er utgående, inngående eller oppgjør MVA."
  }
  if (expected === "5000" || expected === "5400" || expected === "2600" || expected === "2770") {
    return "Riktig område — skill lønnskostnad, AGA-kostnad, trekk og skyldig AGA."
  }
  if (expected === "4000" || expected === "4300" || expected === "1400") {
    return "Riktig klasse — skill lager, innkjøp og vareforbruk."
  }
  if (expectedAccount) {
    return `Riktig kontoklasse (${classDigit}xxx), men feil konto — riktig er ${expected} ${expectedAccount.name}.`
  }
  return `Riktig kontoklasse (${classDigit}xxx), men feil konto.`
}

export function getAccountClassDigit(code: string): string | null {
  return /^\d{4}$/.test(code) ? code[0] : null
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

export const ACCOUNT_CLASS_FILTERS: { id: string; label: string; digit: string | null }[] = [
  { id: "all", label: "Hele kontoplanen", digit: null },
  { id: "1", label: "1xxx Eiendeler", digit: "1" },
  { id: "2", label: "2xxx EK & gjeld", digit: "2" },
  { id: "3", label: "3xxx Inntekter", digit: "3" },
  { id: "4", label: "4xxx Varekost", digit: "4" },
  { id: "5", label: "5xxx Lønn", digit: "5" },
  { id: "6", label: "6xxx Drift", digit: "6" },
  { id: "7", label: "7xxx Andre kost.", digit: "7" },
  { id: "8", label: "8xxx Finans", digit: "8" },
]

/** Horisontale spawn-baner (%) for å unngå overlappende bilag. */
export const SPAWN_LANES = [22, 50, 78] as const
