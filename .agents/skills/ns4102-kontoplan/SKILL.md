---
name: ns4102-kontoplan
description: Maintain NS 4102 chart-of-accounts data, transaction templates, difficulty settings, and spawn lanes for Bilag Blitz Byrå utgave. Use when editing lib/accounting-data.ts, adding bilag, fixing wrong account mappings, or changing game balance.
---

# NS 4102 kontoplan (Bilag Blitz)

Domain skill for the game's accounting content in [`lib/accounting-data.ts`](../../../lib/accounting-data.ts).

## Rules when changing content

1. Keep accounts at **four-digit NS 4102** level (byrå-generell), not niche industry subaccounts.
2. Every `TRANSACTION_TEMPLATES[].correctAccount` **must** exist in `ACCOUNTS`.
3. Prefer Norwegian descriptions and realistic amount ranges. Descriptions must make the *primary* account unambiguous without naming the code.
4. Every template needs `tier` (`easy` | `medium` | `hard` | `expert`), `companyTag`, `keywords`, and `explain` (≤ ~120 chars).
5. `generateTransaction(difficulty)` filters `tier <= selected` (easy ⊂ medium ⊂ hard ⊂ expert).
6. `DIFFICULTY_LABELS` keys must match `DIFFICULTY_LEVELS` keys.
7. `SPAWN_LANES` are horizontal percentages; keep three distinct lanes unless intentionally redesigning spawn.

## Common mappings (do not invent without checking)

| Kontokode | Typisk bilag |
|-----------|--------------|
| 1400 | Varelager |
| 1700 / 2900 | Forskudd / påløpt |
| 1920 | Bankinnskudd / betalinger |
| 2400 | Leverandørgjeld |
| 2701 / 2711 / 2740 | Utgående / inngående / oppgjør MVA |
| 3000 / 3100 | Varesalg / tjenestesalg |
| 4000 / 4300 | Varekost / innkjøp |
| 5000 / 5400 | Lønn / AGA-kostnad |
| 6300 / 6340 / 6780 | Leie / strøm / SaaS |
| 7300 / 7350 / 7360 | Annonse / reise / representasjon |
| 8050 / 8150 | Renteinntekt / rentekostnad |

## After edits

1. Run `pnpm test` (accounting + highscore + feilbok suites).
2. Spot-check one generated bilag in the browser via `$test-bilag-blitz` if the change affects gameplay feel.
3. Keep Nordic company pools via `companyTag` — do not invent random mismatched firms.

## Out of scope

- Tax advice or full bookkeeping software rules
- Changing Neon/Vercel deploy — use `$deploy-bilag-blitz`
