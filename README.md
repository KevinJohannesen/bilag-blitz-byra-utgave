<div align="center">
  <img src="app/icon.png" alt="Bilag Blitz" width="120" />

# Bilag Blitz – Byrå utgave

**Et norsk regnskapsspill der bilag faller ned og du bokfører dem i sanntid.**

Byrå-utgaven har oppdatert NS 4102-kontoplan, lokal toppliste, polert UI og spawn-baner som hindrer overlappende bilag.

![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

**[▶ Spill nå på bilag-blitz.vercel.app](https://bilag-blitz.vercel.app/)**

</div>

---

## Hva er Bilag Blitz?

Bilag Blitz er et nettleserbasert arkadespill der du spiller som bokfører under press. Bilag — kvitteringer og fakturaer fra norske bedrifter — faller ned fra toppen av skjermen. Oppgaven din er å taste inn riktig kontokode fra **Norsk Standard Kontoplan (NS 4102)** før bilaget treffer bunnen.

Jo raskere du svarer, jo flere poeng får du. Feil svar eller bilag som faller forbi den røde linjen koster deg et liv. Klarer du å holde hodet kaldt og bokføre riktig under press?

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

| Grad      | Fallhastighet | Mellomrom | Liv | Poeng/riktig | Tidsbonus-grense |
| --------- | ------------- | --------- | --- | ------------ | ---------------- |
| Lett      | 0.5 px/frame  | 5 sek     | 5   | 100          | 8 sek            |
| Medium    | 0.8 px/frame  | 3.5 sek   | 4   | 150          | 6 sek            |
| Vanskelig | 1.2 px/frame  | 2.5 sek   | 3   | 200          | 4 sek            |
| Ekspert   | 1.6 px/frame  | 2 sek     | 2   | 300          | 3 sek            |

---

## Kontoplan

Spillet er basert på **NS 4102 — Norsk Standard Kontoplan**. Du vil møte kontoer fra alle hovedklassene:

| Klasse | Kategori                   | Eksempler                                                              |
| ------ | -------------------------- | ---------------------------------------------------------------------- |
| 1xxx   | Eiendeler                  | 1200 Maskiner, 1500 Kundefordringer, 1920 Bankinnskudd                 |
| 2xxx   | Gjeld & egenkapital        | 2400 Leverandørgjeld, 2600 Skattetrekk, 2701/2711 MVA, 2770 Skyldig AGA |
| 3xxx   | Inntekter                  | 3000 Salgsinntekt varer, 3100 Salgsinntekt tjenester                   |
| 4xxx   | Varekostnad                | 4000 Varekostnad, 4300 Innkjøp varer                                   |
| 5xxx   | Lønnskostnader             | 5000 Lønn til ansatte, 5400 Arbeidsgiveravgift                         |
| 6–7xxx | Drifts- og andre kostnader | 6300 Leie lokaler, 6700 Regnskap, 7350 Reise, 7770 Bankgebyr           |

Et innebygd **kontooversiktspanel** kan aktiveres for nybegynnere.

---

## Teknisk stack

- **[Next.js 16](https://nextjs.org/)** — App Router, React Server Components
- **[React 19](https://react.dev/)** — spillogikk med hooks og `requestAnimationFrame`-gameloop
- **[TypeScript 5](https://www.typescriptlang.org/)** — full typesikkerhet
- **[Tailwind CSS v4](https://tailwindcss.com/)** — utility-first styling
- **[Shadcn UI](https://ui.shadcn.com/)** — komponentbibliotek (new-york stil)
- **[Radix UI](https://www.radix-ui.com/)** — tilgjengelige UI-primitiver
- **[Lucide React](https://lucide.dev/)** — ikoner

---

## Kom i gang

### Forutsetninger

- Node.js 20+
- pnpm

### Installasjon

```bash
git clone https://github.com/ditt-brukernavn/bilag-blitz.git
cd bilag-blitz
pnpm install
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

---

## Prosjektstruktur

```
bilag-blitz/
├── app/
│   ├── icon.png              # App-ikon og favicon
│   ├── layout.tsx            # Root layout med metadata
│   ├── page.tsx              # Hjemmeside
│   └── globals.css           # Globale stiler og CSS-variabler
├── components/
│   ├── game/
│   │   ├── accounting-game.tsx   # Hoved-spillkomponent og gameloop
│   │   ├── falling-receipt.tsx   # Animert bilag-komponent
│   │   ├── account-panel.tsx     # Inndatafelt og kontooversikt
│   │   └── game-stats.tsx        # Poeng, liv, streak og tid
│   ├── ui/                       # Shadcn UI-komponenter
│   └── theme-provider.tsx        # Dark mode-støtte
├── hooks/
│   ├── use-mobile.ts         # Responsiv breakpoint-hook
│   └── use-toast.ts          # Toast-notifikasjoner
└── lib/
    ├── accounting-data.ts    # NS 4102-kontoplan og transaksjonsdata
    ├── highscore.ts          # Lokal toppliste (localStorage)
    └── utils.ts              # Tailwind cn()-hjelper
```

---

## Lisens

MIT

---

<div align="center">
  <sub>Kildekode tilgjengelig på <a href="https://github.com/KevinJohannesen/bilag-blitz-byra-utgave">github.com/KevinJohannesen/bilag-blitz-byra-utgave</a></sub>
</div>
