---
name: deploy-bilag-blitz
description: Deploy Bilag Blitz Byrå utgave to Vercel with Neon Postgres leaderboard (DATABASE_URL, drizzle push, env sync). Use when shipping to production, fixing prod toppliste, creating/rotating Neon credentials, or linking the GitHub repo to Vercel.
---

# Deploy Bilag Blitz

Production stack: **Vercel** + **Neon Postgres** + **Drizzle**.

## Prerequisites

- Logged in: `npx vercel whoami`, `npx neonctl me`
- Repo: `KevinJohannesen/bilag-blitz-byra-utgave`
- Vercel project: `bilag-blitz-byra-utgave` (scope `kevins-projects-77ad4068` unless changed)
- Neon project name: `bilag-blitz-byra-utgave`

## Ship a change

1. Ensure tests pass: `pnpm test`
2. Commit and push to `main` (or deploy from local with `npx vercel deploy --prod --scope kevins-projects-77ad4068 --yes`)
3. Confirm production alias: https://bilag-blitz-byra-utgave.vercel.app
4. Smoke the API:

```bash
curl -sS https://bilag-blitz-byra-utgave.vercel.app/api/leaderboard
```

## Database

Schema lives in [`lib/db/schema.ts`](../../../lib/db/schema.ts). Apply with:

```bash
# uses DATABASE_URL from .env.local then .env
pnpm db:push
```

`drizzle.config.ts` loads `.env.local` first. Never commit `.env.local`.

### New Neon project / rotate URL

```bash
npx neonctl projects create --name bilag-blitz-byra-utgave --region-id aws-eu-central-1
npx neonctl connection-string --project-id <id>
```

Write the URI to `.env.local`, run `pnpm db:push`, then sync Vercel:

```bash
printf '%s' "$DATABASE_URL" | npx vercel env add DATABASE_URL production --scope kevins-projects-77ad4068 --yes
# repeat for preview (+ development if needed)
npx vercel deploy --prod --scope kevins-projects-77ad4068 --yes
```

## Checklist

- [ ] `DATABASE_URL` set for Production / Preview on Vercel
- [ ] `leaderboard_scores` table exists (`pnpm db:push`)
- [ ] `/api/leaderboard` returns JSON on prod
- [ ] Game HUD still shows hearts; toppliste text says shared list

## Do not

- Point testing at unrelated Neon projects without asking
- Force-push or amend shared history unless the user requests it
- Print full connection strings in commits, screenshots, or public docs
