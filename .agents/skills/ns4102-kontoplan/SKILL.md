---
name: ns4102-kontoplan
description: Maintain NS 4102 chart-of-accounts data, transaction templates, difficulty settings, and spawn lanes for Bilag Blitz Byrå utgave. Use when editing lib/accounting-data.ts, adding bilag, fixing wrong account mappings, or changing game balance.
---

# NS 4102 kontoplan (Bilag Blitz)

Domain skill for the game's accounting content in [`lib/accounting-data.ts`](../../../lib/accounting-data.ts).

## Rules when changing content

1. Keep accounts at **four-digit NS 4102** level (byrå-generell), not niche industry subaccounts.
2. Every `TRANSACTION_TEMPLATES[].correctAccount` **must** exist in `ACCOUNTS`.
3. Prefer Norwegian descriptions and realistic amount ranges.
4. `DIFFICULTY_LABELS` keys must match `DIFFICULTY_LEVELS` keys (`easy` | `medium` | `hard` | `expert`).
5. `SPAWN_LANES` are horizontal percentages; keep three distinct lanes unless intentionally redesigning spawn.

## Common mappings (do not invent without checking)

| Kontokode | Typisk bilag |
|-----------|--------------|
| 1920 | Bankinnskudd / betalinger inn |
| 2400 | Leverandørfaktura |
| 2701 / 2711 | Utgående / inngående MVA |
| 3000 / 3100 | Varesalg / tjenestesalg |
| 4000 / 4300 | Varekost / innkjøp |
| 5000 / 5400 | Lønn / AGA |
| 6300 / 6700 / 7350 | Leie / regnskap / reise |

## After edits

1. Run `pnpm test` (accounting + highscore suites).
2. Spot-check one generated bilag in the browser via `$test-bilag-blitz` if the change affects gameplay feel.
3. Do not hardcode English company names; keep Nordic flavour in prefixes/suffixes.

## Out of scope

- Tax advice or full bookkeeping software rules
- Changing Neon/Vercel deploy — use `$deploy-bilag-blitz`
