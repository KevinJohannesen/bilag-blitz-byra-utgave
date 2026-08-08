---
name: test-bilag-blitz
description: Launch, retain, and verify Bilag Blitz Byrå utgave locally — Next.js dev server, browser game flow, shared Neon leaderboard API, and worktree-safe env. Use when testing the game UI, leaderboard GET/POST, spawn/lives behavior, or iterating on changes with a live local environment.
---

# Test Bilag Blitz

Use this skill for local verification of the Byrå-utgave Next.js game. Prefer automated unit tests (`pnpm test`) for pure logic; use this skill for end-to-end browser and API checks.

## Start an isolated web environment

1. Run commands from the repository root (`bilag-blitz-byra-utgave`).
2. Ensure `.env.local` contains a valid `DATABASE_URL` (Neon). Copy from `.env.example` if missing, then run `pnpm db:push` once against that database.
3. Prefer port **3001** when the original `bilag-blitz` may already occupy 3000:

```bash
pnpm dev -- --port 3001
```

4. Keep the terminal session alive. Read the actual local URL from the Next output.
5. Do not stop the server merely because one verification pass finished or because you are yielding to the user. Reuse a healthy existing `next dev` process when it still serves this worktree.

## Authenticate / open the app

This app has no login. Open the origin once in the controlled browser (T3 Code preview or Cursor browser tools):

- Menu loads with brand **Bilag Blitz**, difficulty buttons, **Start Blitz**, **Dagens utfordring**, **Øvingsmodus**, and **Toppliste** (Blitz / Dagens tabs)
- Toppliste subtitle should say it is shared across players (not localStorage)
- Hearts (`♥`) render for lives in the HUD during play
- Daily HUD shows `Dagens N/15` progress when in dagens utfordring

## Verify the shared leaderboard

Against the running origin (replace host/port as needed):

```bash
curl -sS "http://127.0.0.1:3001/api/leaderboard?difficulty=medium"
curl -sS "http://127.0.0.1:3001/api/leaderboard?difficulty=medium&mode=daily&date=$(TZ=Europe/Oslo date +%F)"
curl -sS -X POST "http://127.0.0.1:3001/api/leaderboard" \
  -H "Content-Type: application/json" \
  -d '{"name":"AgentTest","score":123,"level":1,"difficulty":"medium"}'
curl -sS -X POST "http://127.0.0.1:3001/api/leaderboard" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"DailyAgent\",\"score\":456,\"level\":2,\"difficulty\":\"medium\",\"mode\":\"daily\",\"challengeDate\":\"$(TZ=Europe/Oslo date +%F)\"}"
```

Expect:

- `GET` (blitz) → `{ "entries": [...], "mode": "blitz" }` sorted by score desc, max 10
- `GET` (daily) → `{ "entries": [...], "mode": "daily", "date": "YYYY-MM-DD" }` — separate from Blitz
- Valid `POST` → `201` with updated `entries`
- Invalid body (bad difficulty / non-positive score / daily uten dato) → `400`
- Score that does not beat the board when full → `409`

After schema changes that add `mode` / `challenge_date`, run `pnpm db:push` once before expecting daily boards to work against Neon.

Do not commit secrets from `.env.local`. Prefer unique test names so smoke scores are identifiable.

## Browser game smoke path

1. Open the menu; confirm toppliste loads (or shows empty / error copy if API fails).
2. Choose a difficulty; start the game.
3. Confirm falling receipts, account input, and heart lives.
4. Optionally force game over and exercise save-to-leaderboard when the score qualifies.
5. Capture a screenshot of the final relevant state when handing off to the user.

## Tear down only when the loop is finished

Tear down when the user asks, confirms iteration is done, or the task is complete with no pending review.

1. Stop only the `next dev` process started for this test.
2. Leave Neon data intact unless the user asks to clean smoke-test rows.
3. If completion is uncertain, keep the server alive and say so.

## Troubleshoot

- **Toppliste error in UI:** confirm `DATABASE_URL` in `.env.local` and that `pnpm db:push` created `leaderboard_scores`.
- **Port busy:** pick another port; trust the URL Next prints.
- **POST 500:** check Neon connectivity / SSL and Vercel env parity (`DATABASE_URL` on the deployed project).
- **Unit regressions:** run `pnpm test` before claiming green.
