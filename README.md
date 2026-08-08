<div align="center">
  <img src="app/icon.png" alt="Bilag Blitz" width="120" />

# Bilag Blitz – Byrå utgave

**Et norsk regnskapsspill der bilag faller ned og du bokfører dem i sanntid.**

Byrå-utgaven har utvidet NS 4102-kontoplan, **Blitz** + **Øvingsmodus**, feilbok, vanskelighetsstyrt bilagutvalg og delt toppliste per grad (Neon).

![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

**[▶ Spill nå på bilag-blitz-byra-utgave.vercel.app](https://bilag-blitz-byra-utgave.vercel.app/)**

</div>

---

## Hva er Bilag Blitz?

Bilag Blitz er et nettleserbasert arkadespill der du spiller som bokfører under press. Bilag — kvitteringer og fakturaer fra norske bedrifter — faller ned fra toppen av skjermen. Oppgaven din er å taste inn riktig kontokode fra **Norsk Standard Kontoplan (NS 4102)** før bilaget treffer bunnen.

Jo raskere du svarer, jo flere poeng får du. Feil svar eller bilag som faller forbi den røde linjen koster deg et liv — og legges i **feilboken** så du kan øve etterpå.

Kontoplanen er **byrå-generell NS 4102** (firesiffer): samme koder uansett hvilken klient du jobber med.

**Øvingsmodus** lar deg lære uten fallende bilag — med forklaring etter hvert svar, filter på kontoklasse, eller «Mine feil» fra siste Blitz-runde.

---

## Spillregler

| Hendelse                     | Konsekvens                      |
| ---------------------------- | ------------------------------- |
| Riktig kontokode             | Poeng + tidsbonus + streakbonus |
| Feil kontokode               | −1 liv, streak nullstilles      |
| Bilag faller forbi rød linje | −1 liv, streak nullstilles      |
| Alle liv tapt                | Spill over                      |

**Streakbonus** — jo lengre rekke av riktige svar, jo høyere bonuspoeng per bokføring.

**Tidsbonus** — raske svar gir ekstra poeng. Grensen varierer med vanskelighetsgrad.

**Nivåsystem** — for hvert 1 000 poeng stiger du et nivå. Høyere nivå = raskere fallhastighet og kortere intervall mellom nye bilag.

---

## Vanskelighetsgrader

| Grad      | Fallhastighet | Mellomrom | Liv | Poeng/riktig | Tidsbonus-grense | Bilaginnhold                          |
| --------- | ------------- | --------- | --- | ------------ | ---------------- | ------------------------------------- |
| Lett      | 0.5 px/frame  | 5 sek     | 5   | 100          | 8 sek            | Daglige kontorkostnader, bank         |
| Medium    | 0.8 px/frame  | 3.5 sek   | 4   | 150          | 6 sek            | + inntekter, fordring/gjeld, vare/lønn |
| Vanskelig | 1.2 px/frame  | 2.5 sek   | 3   | 200          | 4 sek            | + MVA, periodisering, aktivering       |
| Ekspert   | 1.6 px/frame  | 2 sek     | 2   | 300          | 3 sek            | + fine skillet (MVA/AGA/varekost)      |

**Topplisten** er per vanskelighetsgrad, så Lett-rekorder ikke overskygger Ekspert.

**Dagens utfordring** gir 15 seedede bilag for dagens dato (Europe/Oslo) med egen toppliste (`mode=daily&date=YYYY-MM-DD`).

---

## Kontoplan

Spillet er basert på **NS 4102 — Norsk Standard Kontoplan**. Du vil møte kontoer fra alle hovedklassene:

| Klasse | Kategori                   | Eksempler                                                                          |
| ------ | -------------------------- | ---------------------------------------------------------------------------------- |
| 1xxx   | Eiendeler                  | 1200 Maskiner, 1400 Varelager, 1500 Fordringer, 1700 Forskudd, 1920 Bank           |
| 2xxx   | Gjeld & egenkapital        | 2400 Leverandør, 2600 Skattetrekk, 2701/2711/2740 MVA, 2770 AGA, 2900 Påløpt       |
| 3xxx   | Inntekter                  | 3000 Salgsinntekt varer, 3100 Salgsinntekt tjenester                               |
| 4xxx   | Varekostnad                | 4000 Varekostnad, 4300 Innkjøp varer                                               |
| 5xxx   | Lønnskostnader             | 5000 Lønn til ansatte, 5400 Arbeidsgiveravgift                                     |
| 6–7xxx | Drifts- og andre kostnader | 6300 Leie, 6340 Strøm, 6780 SaaS, 7300 Annonse, 7350 Reise, 7360 Representasjon    |
| 8xxx   | Finans                     | 8050 Renteinntekt, 8150 Rentekostnad                                               |

Et innebygd **kontooversiktspanel** og myke tips kan aktiveres for nybegynnere.

---

## Teknisk stack

- **[Next.js 16](https://nextjs.org/)** — App Router, React Server Components
- **[React 19](https://react.dev/)** — spillogikk med hooks og `requestAnimationFrame`-gameloop
- **[TypeScript 5](https://www.typescriptlang.org/)** — full typesikkerhet
- **[Tailwind CSS v4](https://tailwindcss.com/)** — utility-first styling
- **[Neon](https://neon.tech/)** + **[Drizzle ORM](https://orm.drizzle.team/)** — delt toppliste i Postgres
- **[Vitest](https://vitest.dev/)** — enhetstester for spill- og API-logikk
- **[Shadcn UI](https://ui.shadcn.com/)** — komponentbibliotek (new-york stil)
- **[Radix UI](https://www.radix-ui.com/)** — tilgjengelige UI-primitiver
- **[Lucide React](https://lucide.dev/)** — ikoner

---

## Kom i gang

### Forutsetninger

- Node.js 20+
- pnpm
- En Neon Postgres-database (`DATABASE_URL`)

### Installasjon

```bash
git clone https://github.com/KevinJohannesen/bilag-blitz-byra-utgave.git
cd bilag-blitz-byra-utgave
pnpm install
cp .env.example .env.local
```

Sett `DATABASE_URL` i `.env.local`, deretter opprett tabellen:

```bash
pnpm db:push
```

### Kjør lokalt

```bash
pnpm dev
```

Åpne [http://localhost:3000](http://localhost:3000) i nettleseren.

### Bygg for produksjon

```bash
pnpm build
pnpm start
```

### Tester

```bash
pnpm test
pnpm test:watch
```

### Agent skills (Theo / T3-stil)

Prosjekt-skills ligger i `.agents/skills/` (symlinket til `.claude/skills` og `.cursor/skills`):

| Skill | Bruk |
|-------|------|
| `$test-bilag-blitz` | Lokal verifisering av spill + toppliste-API |
| `$ns4102-kontoplan` | Endringer i kontoplan / bilagmaler |
| `$deploy-bilag-blitz` | Neon + Vercel deploy |

### Deploy (Vercel)

1. Opprett et Neon-prosjekt og kopier connection string
2. Importer repoet i Vercel (eller `npx vercel`)
3. Sett `DATABASE_URL` under Project Settings → Environment Variables
4. Kjør `pnpm db:push` mot samme database (lokalt med prod-URL, eller Neon SQL Editor)
5. Deploy

---

## Prosjektstruktur

```
bilag-blitz-byra-utgave/
├── app/
│   ├── api/leaderboard/      # GET/POST delt toppliste
│   ├── icon.png
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── game/
│   │   ├── accounting-game.tsx
│   │   ├── practice-mode.tsx
│   │   ├── falling-receipt.tsx
│   │   ├── account-panel.tsx
│   │   └── game-stats.tsx
│   └── ui/
├── lib/
│   ├── db/                   # Drizzle + Neon
│   ├── accounting-data.ts    # NS 4102 + tiered bilag
│   ├── daily-challenge.ts    # Seedet dagens utfordring (Oslo)
│   ├── feilbok.ts            # Session mistake log
│   ├── highscore.ts          # Toppliste-klient + validering
│   ├── spawn-lanes.ts
│   └── utils.ts
├── .agents/skills/           # Agent skills (T3/Claude/Cursor)
└── drizzle.config.ts
```

---

## Lisens

MIT

---

<div align="center">
  <sub>Kildekode tilgjengelig på <a href="https://github.com/KevinJohannesen/bilag-blitz-byra-utgave">github.com/KevinJohannesen/bilag-blitz-byra-utgave</a></sub>
</div>
