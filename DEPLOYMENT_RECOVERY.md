# GitNews Deployment Recovery Runbook

## Problem
The deployed Cloudflare Pages site (`https://81666430.gitnews.pages.dev/`) renders empty content — no repositories, trending cards, or AI analysis are displayed. The header and navigation load, but the Convex-backed content areas show "No matching repositories found" or infinite loading states.

## Root Cause (confirmed)
The frontend connects to Convex using `PUBLIC_CONVEX_URL`. If the database is empty (no `repositories` or `news` rows), every feed returns an empty array. The database is empty because the GitHub → AI → Convex sync pipeline has never been triggered in the production Convex deployment, or it failed due to missing environment variables.

## Required Environment Variables

### 1. Cloudflare Pages (build-time + runtime)
| Variable | Value | Purpose |
|----------|-------|---------|
| `PUBLIC_CONVEX_URL` | `https://limitless-kiwi-886.convex.cloud` | Allows the Astro frontend to connect to Convex |
| `NODE_VERSION` | `20` (recommended) | Build environment |
| `BUN_VERSION` | `1.1.x` (if using Bun) | Package manager |

Add them in the Cloudflare dashboard: **Pages → gitnews → Settings → Environment variables**.

After adding/changing variables, trigger a redeploy: **Deployments → ... → Retry deployment**.

### 2. Convex Dashboard (backend runtime)
| Variable | Value | Purpose |
|----------|-------|---------|
| `TOGETHER_API_KEY` | `YOUR_API_KEY` | Powers AI summaries for each repo |
| `TOGETHER_BASE_URL` | `https://api.together.xyz/v1` | OpenAI-compatible base URL |
| `GITHUB_TOKEN` (optional but strongly recommended) | `ghp_...` | Raises GitHub Search API rate limit from 10 req/min to 5,000 req/hr |

Add them in the Convex dashboard: **Settings → Environment variables**.

> **Security note:** Do NOT commit these values to the repo. `.env` and `.env.local` files are git-ignored, but Cloudflare Pages also exposes `PUBLIC_` variables to the browser — only `PUBLIC_CONVEX_URL` should be public.

## Recovery Steps

### Step 1 — Verify backend is reachable
Open this URL in your browser (it should return a small JSON with Convex metadata if the URL is correct):
```
https://limitless-kiwi-886.convex.cloud/version
```

If it returns a JSON response, the URL is correct. If it 404s, the project name is wrong.

### Step 2 — Seed sample data without AI (fast smoke test)
If you don't have a Together AI key yet, run this from the project root to insert 20 sample repositories so the frontend is not empty:

```bash
cd packages/backend
npx convex run github:seedSampleRepositories
```

This mutation is safe — it uses static sample data and does not call GitHub or Together AI. It is intended only for initial smoke testing and will be overwritten later by real data.

### Step 3 — Trigger the real GitHub + AI sync
Once the environment variables are set in Convex, run:

```bash
cd packages/backend
npx convex run github:scheduleGitHubSync
```

This schedules `syncGitHubData` immediately. The sync will:
1. Query 4 GitHub Search endpoints (80 total results, de-duplicated).
2. Fetch each repo's README.
3. Call Together AI to generate `aiSummary`, `developerAnalysis`, and `verdict`.
4. Upsert all data into `repositories` and `categories`.
5. Schedule itself to run again in 1 hour.

Watch the Convex logs: **Functions → Logs** in the Convex dashboard. The first run may take 30–90 seconds depending on GitHub rate limits and AI latency.

### Step 4 — Seed the news table
```bash
cd packages/backend
npx convex run news:seedNews
```

### Step 5 — Verify the deployed site
After redeploying Cloudflare Pages, visit:
- `https://81666430.gitnews.pages.dev/` — homepage should show repository cards.
- `https://81666430.gitnews.pages.dev/repos` — should show a repository browser.
- `https://81666430.gitnews.pages.dev/trending` — should show trending cards.
- `https://81666430.gitnews.pages.dev/ai` — should show AI-focused repositories.
- `https://81666430.gitnews.pages.dev/news` — should show news dispatches.

Open browser DevTools → Network and look for `convex.cloud` WebSocket or HTTP requests. If none appear, `PUBLIC_CONVEX_URL` is not set in Cloudflare.

## Troubleshooting

### Symptom: `401 Unauthorized` on Convex requests
- `PUBLIC_CONVEX_URL` is wrong or the Convex deployment is deleted/recreated.
- Check the URL in the Convex dashboard: **Settings → URL**.

### Symptom: Convex sync fails with `429 Too Many Requests`
- GitHub Search API unauthenticated rate limit is 10 requests/minute.
- Add `GITHUB_TOKEN` to Convex environment variables.

### Symptom: AI summaries are empty
- `TOGETHER_API_KEY` is missing or invalid.
- `TOGETHER_BASE_URL` is missing or wrong.
- Check Convex logs for `Together AI summarization failed:`.

### Symptom: Sync runs but data is still missing from the frontend
- The frontend page may be using a different query. Verify `apps/astro-web/src/lib/convex.tsx` uses `PUBLIC_CONVEX_URL`.
- Hard-refresh the browser (Ctrl+Shift+R) to clear cached HTML.
- Check the browser console for React hydration errors.

### Symptom: `scheduleGitHubSync` returns "internal action cannot be run directly"
You are probably running `npx convex run github:syncGitHubData`. Use `github:scheduleGitHubSync` instead — it is an `internalMutation` that schedules the `internalAction`.

## Optional: Schedule recurring sync automatically
After the first successful run, the sync will automatically reschedule itself every hour. You can also set up a Convex cron job if you prefer a predictable schedule. Add to `packages/backend/convex/crons.ts` (create if missing):

```typescript
import { cronJobs } from "./_generated/server";
import { internal } from "./_generated/api";

cronJobs.interval(
  "hourly GitHub sync",
  { minutes: 60 },
  internal.github.syncGitHubData,
  {},
);
```

Then deploy with `npx convex dev` or `npx convex deploy`.

## Post-Recovery Next Steps
1. Verify all 6 core routes load data (`/`, `/trending`, `/ai`, `/news`, `/repos`, `/live`).
2. Implement missing routes: `/analyze`, `/discover`, `/olla/*`, `/learning/*`, `/market/*`, `/space/*`.
3. Add a proper footer component.
4. Add production error boundaries and loading skeletons.
5. Add SEO meta tags per page.
6. Remove remaining mock data from components.
