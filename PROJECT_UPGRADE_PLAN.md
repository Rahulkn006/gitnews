# GitNews — Project Upgrade Plan

> **Goal**: Transform GitNews from "a list of repositories" into an editorial intelligence platform that answers:
> 1. What repositories are becoming important?
> 2. Why are developers watching them?
> 3. What changed recently?
> 4. Is this worth learning or using?
>
> **Identity**: Bloomberg Terminal + Hacker News + GitHub Trending + Developer Newspaper.
>
> **Rules**: Do NOT rewrite. Do NOT remove working sections. Do NOT replace the newspaper identity.

---

## 1. Architecture Overview (Current State)

### Monorepo Structure
```
internproject/gitnews/convex-template5-main/convex-template5-main/
├── apps/
│   ├── astro-web/         ← PRIMARY FRONTEND (Astro + React Islands)
│   ├── web/               ← Legacy Next.js app (still functional)
│   └── app/               ← Template app shell (unused)
├── packages/
│   ├── backend/convex/    ← Convex serverless backend
│   ├── ui/                ← Shared UI package (Tailwind preset)
│   ├── analytics/         ← Analytics package
│   ├── email/             ← Email package
│   └── logger/            ← Logger package
└── tooling/               ← Build tooling
```

### Astro Frontend (`apps/astro-web/`)
- **Framework**: Astro v4.16.19 with `hybrid` output mode + `@astrojs/node` adapter
- **React Islands**: 19 components hydrated via `client:load`
- **Styling**: Tailwind CSS with custom `globals.css` (HSL CSS variables, dark/light themes)
- **Fonts**: Lora (serif), Geist Sans, Geist Mono, Departure Mono
- **Convex Pattern**: `withConvex()` HOC wraps each island with its own `ConvexProvider`

### Convex Backend (`packages/backend/convex/`)
- **Tables**: `repositories`, `news`, `categories`, `bookmarks` (+ auth/workspace tables from template)
- **GitHub Sync**: `syncGitHubData` — fetches from GitHub Search API, generates AI summaries via Together AI (Llama-3-70b)
- **News Seed**: `seedNews` — inserts 6 hardcoded news stories
- **Queries**: `getTrendingRepos`, `getFeaturedRepos`, `getLatestRepos`, `getReposByCategory`, `getRepoDetails`, `getNews`
- **Mutations**: `bookmarkRepo`, `removeBookmark`, `toggleBookmark`
- **URL**: `https://limitless-kiwi-886.convex.cloud`

---

## 2. Route Map (All Working — HTTP 200 ✅)

| Route | Astro Page | React Island | Purpose |
|-------|-----------|-------------|---------|
| `/` | `index.astro` | `GitNewsFeed` | Homepage magazine with ticker, featured story, compact feed, sidebars |
| `/trending` | `trending.astro` | `TrendingFeed` | 4-section grid: Today / This Week / Fastest Growing / Most Starred |
| `/ai` | `ai.astro` | `AIFeed` | AI-filtered repos + AI-filtered news sidebar |
| `/news` | `news.astro` | `NewsFeed` | "The Chronicle" — lead story + latest news articles |
| `/live` | `live.astro` | `LivePulseFeed` | Real-time pulse cards with trending score, sentiment, sources |
| `/repos` | `repos/index.astro` | `ReposBrowser` | Search + filter repository grid |
| `/repos/[owner]/[name]` | `repos/[owner]/[name].astro` | `RepoArticlePage` | Single repo intelligence report (SSR, prerender=false) |

**Dead links in nav** (pages don't exist): `/analyze`, `/discover`

---

## 3. Existing Working Features ✅

### Strong and Reusable
| Feature | Component | Status | Notes |
|---------|-----------|--------|-------|
| **Newspaper layout** | `GitNewsFeed` | ✅ Working | 3-column bento layout, serif fonts, monospace accents |
| **Live wire ticker** | `BreakingTicker` | ✅ Fixed | Smooth marquee, pause on hover (just fixed speed) |
| **Theme toggle** | `ThemeToggle` | ✅ Fixed | Direct DOM manipulation (just fixed context issue) |
| **Dark/light CSS system** | `globals.css` | ✅ Working | Full HSL variable system, newspaper surface tokens |
| **Compact news cards** | `CompactRepoNewsCard` | ✅ Working | Thumbnail + headline + metadata strip |
| **Large editorial card** | `RepoCard` (large) | ✅ Working | Gradient header, avatar, badge, WhyTrending section |
| **Small/medium cards** | `RepoCard` (small/medium) | ✅ Working | Good for grid layouts |
| **News article cards** | `NewsCard` | ✅ Working | Category badge, impact score, repository link |
| **Ecosystem pulse timeline** | `GithubPulse` | ✅ Working | Mock timeline with color-coded events |
| **Live pulse dashboard** | `LivePulseFeed` | ✅ Working | Animated signal cards with trending score, sentiment, sources |
| **Star velocity graph** | `MiniStarGraph` | ✅ Working | SVG sparkline with gradient fill |
| **Contribution heatmap** | `ContributionHeatmap` | ✅ Working | GitHub-style commit grid |
| **Language color bar** | `LanguageBar` | ✅ Working | Percentage-based language bar |
| **Why trending panel** | `WhyTrending` | ✅ Working | Star velocity + release activity + social mentions |
| **Search + filter** | `SearchFilter` | ✅ Working | Input + category pill buttons |
| **Mobile navigation** | `MobileMenu` | ✅ Working | Slide-out drawer with nav links |
| **Navbar** | `Navbar.astro` | ✅ Working | Sticky, dark/light, utility bar |
| **withConvex HOC** | `convex.tsx` | ✅ Working | Clean pattern for Astro React islands |
| **Data mapper layer** | `data-mapper.ts` | ✅ Working | Maps Convex DB → frontend types cleanly |
| **GitHub sync backend** | `github.ts` | ✅ Working | Auto-schedules hourly, deduplicates, fetches README + AI summary |
| **Badge system** | `repo-card.tsx` | ✅ Working | Trending / Launch / New Star / Rising based on stars/forks |
| **Bookmark mutations** | `github.ts` | ✅ Working | Full CRUD for authenticated bookmarks |

### Design System Assets
- Emerald accent (primary), stone surfaces, serif headings, mono metadata
- Cut-corner utility classes, gradient mesh, card glow hover effects
- Consistent `tracking-widest uppercase text-[10px]` label pattern
- Paper/ink/kicker/rule custom tokens for newspaper feel

---

## 4. Weak Areas & Problems 🔴

### 4.1 — Content is "Repository Listing", Not "Intelligence"

**This is the core problem.** The current homepage answers "here are some repos sorted by stars" — NOT the four questions the platform should answer.

| Problem | Where | Detail |
|---------|-------|--------|
| **Featured story uses a news item, not a repo analysis** | `gitnews-feed.tsx:105-123` | Takes `news[0]` and force-maps it into a `RepoCard` with hardcoded stars (125000) and forks (10000) |
| **"Today's Repository Stories" is just a sorted-by-stars list** | `gitnews-feed.tsx:127-138` | No editorial narrative, no "why", no change analysis |
| **Right sidebar "Trending Today" uses Math.random()** | `gitnews-feed.tsx:165` | `+{Math.floor(Math.random() * 500 + 100)}` — fake data rendered on each paint |
| **"Repository Releases" sidebar is entirely hardcoded** | `gitnews-feed.tsx:174-189` | Static "Next.js 15 RC" and "TailwindCSS v4.0" text — never changes |
| **Growth stats are fabricated** | `compact-repo-news-card.tsx:57-58` | `weeklyGrowth || Math.floor(Math.random() * 200 + 50)` and `timeAgo = Math.floor(Math.random() * 59 + 1)` |

### 4.2 — AI Summaries Are Not Editorial Intelligence

| Problem | Where | Detail |
|---------|-------|--------|
| **AI summary prompt is too generic** | `github.ts:50` | "1-sentence description summarizing purpose" — this is a tagline, not intelligence |
| **No "why trending" data** | Backend schema | No `weeklyStarDelta`, `commitActivity`, `releaseHistory`, `prVelocity` fields |
| **No recent change analysis** | Backend schema | No `latestRelease`, `lastCommitDate`, `openIssuesCount`, `recentPRs` |
| **trendingScore = stars + forks** | `github.ts:188` | This is not a trending score — a repo with 200k stars and 50k forks always wins |

### 4.3 — Data Layer Gaps

| Problem | Where | Detail |
|---------|-------|--------|
| **News is seed-only, never updated** | `news.ts` | `seedNews` inserts 6 items once; no dynamic news generation |
| **News `source` field is misused as `repository`** | `data-mapper.ts:79` | `repository: newsItem.source` — mapping "arXiv / SonarSource" as a repo name |
| **No news-to-repository linking** | Schema | News items have no foreign key to `repositories` table |
| **Category assignment is language-based** | `github.ts:190` | `buildCategory(repo.language ?? repo.name)` — categorizes by programming language, not project domain |
| **GitHub API queries are generic** | `github.ts:136-148` | All 4 queries are basic `stars:>N` searches — no date-range trending, no weekly-growth detection |
| **Static fallback data** | `data/` directory | `repositories.ts`, `news.ts`, `liveSignals.ts` — mock data never removed, used as type sources |

### 4.4 — Repo Article Page Is Mostly Fake

| Problem | Where | Detail |
|---------|-------|--------|
| **Hardcoded stats** | `repo-article-page.tsx:27-28` | `stars: 125000, forks: 14000` — always the same numbers |
| **AI Summary section is static prose** | `repo-article-page.tsx:98-100` | Hardcoded string: "performance improved by 40%... new plugin system has galvanized the community" |
| **Release data is fake** | `repo-article-page.tsx:132-138` | Static "v2.4.0" and "v2.3.5" — never fetched from GitHub |
| **No actual repo query** | `repo-article-page.tsx:10` | Only queries `news` table, not `repositories` — doesn't fetch the actual repo data |

### 4.5 — UX Issues

| Problem | Where | Detail |
|---------|-------|--------|
| **Left sidebar categories are non-functional** | `gitnews-feed.tsx:93-98` | Buttons have no click handlers — they do nothing |
| **Duplicate navigation** | `gitnews-feed.tsx:68-85` | Homepage renders its own internal nav banner below the Navbar — two navs |
| **Loading skeletons are identical spinners** | All feed components | Every page shows the same "Fetching Intelligence..." spinner |
| **No error boundaries** | All React islands | A Convex query failure crashes the entire island |
| **Dead nav links** | `gitnews-feed.tsx:76-79` | `/analyze` and `/discover` routes linked but don't exist |

### 4.6 — Code Duplication

| Duplicated Code | Files |
|----------------|-------|
| `langColors` map | `repo-card.tsx`, `compact-repo-news-card.tsx` |
| `formatNumber()` | `repo-card.tsx`, `compact-repo-news-card.tsx` |
| `getBadge()` | `repo-card.tsx`, `compact-repo-news-card.tsx` |
| `badgeStyles` | `repo-card.tsx`, `compact-repo-news-card.tsx` |
| `hashString()` + `generateGradient()` | `repo-card.tsx`, `compact-repo-news-card.tsx` |
| Loading spinner JSX | All 6 feed components |

### 4.7 — Dead Code

| File | Issue |
|------|-------|
| `convex-client-provider.tsx` | Imports `@/env` (doesn't exist in Astro), uses `NEXT_PUBLIC_CONVEX_URL` — legacy Next.js leftover |
| `theme-provider.tsx` | Wraps slot content but ThemeToggle lives outside it in Navbar — provider has no effect on the toggle |
| Mock data arrays in `data/*.ts` | Types are used but mock arrays are never imported anywhere |

---

## 5. Component Reuse Map

### Keep As-Is (Strong Components)
- ✅ `Navbar.astro` + `MobileMenu` — solid responsive nav
- ✅ `Layout.astro` — clean shell with inline theme script
- ✅ `ThemeToggle` — just fixed, works independently now
- ✅ `BreakingTicker` — just fixed speed, good live-wire feel
- ✅ `MiniStarGraph` — reusable SVG sparkline
- ✅ `ContributionHeatmap` — reusable commit-style grid
- ✅ `LanguageBar` — reusable percentage bar
- ✅ `SearchFilter` — generic search + category filter
- ✅ `withConvex` HOC — clean Astro-compatible Convex wrapper
- ✅ `data-mapper.ts` — extend, don't replace

### Refactor (Good Bones, Needs Work)
- 🔧 `RepoCard` — extract shared utils, add real data props for growth/changes/releases
- 🔧 `CompactRepoNewsCard` — remove Math.random(), add real delta data, make headline editorial
- 🔧 `NewsCard` — fix repository mapping, add actual repo link
- 🔧 `WhyTrending` — currently hardcoded "1,204 this week" and "v2.1 just dropped" — needs real data props
- 🔧 `GithubPulse` — currently all MOCK_EVENTS — needs real Convex data
- 🔧 `GitNewsFeed` — remove duplicate nav, fix fake sidebar data, remove hardcoded featured story
- 🔧 `RepoArticlePage` — needs actual repo query, real stats, real AI analysis
- 🔧 `LivePulseFeed` — good structure, needs richer signal data

### Remove / Replace
- ❌ `convex-client-provider.tsx` — dead code, references non-existent `@/env`
- ❌ Mock arrays in `data/repositories.ts`, `data/news.ts`, `data/liveSignals.ts` — keep type interfaces, remove mock arrays

---

## 6. Backend Changes Needed

### Schema Extensions (Additive — No Breaking Changes)
The `repositories` table needs additional fields to answer the 4 questions:

```
repositories table — NEW optional fields:
├── weeklyStarDelta: number        → "What's changing?" (stars gained this week)
├── weeklyForkDelta: number        → Fork velocity
├── latestRelease: string          → "What changed recently?" (tag name)
├── latestReleaseDate: number      → When was the last release
├── openIssuesCount: number        → Community health signal
├── recentCommitCount: number      → "Is this actively maintained?"
├── lastCommitDate: number         → Freshness signal
├── watchersCount: number          → "Why are developers watching?"
├── editorialSummary: string       → AI-generated editorial intelligence (longer, narrative)
└── whyTrending: string            → AI-generated "why this matters" paragraph
```

### New Queries Needed
- `getRepoByOwnerName(owner, name)` — for the article page (currently doesn't exist!)
- `getTrendingWithDelta()` — returns repos with computed weekly growth

### GitHub Sync Improvements
- Add date-range queries (e.g., `created:>2026-07-01`) to detect genuinely new rising repos
- Fetch releases via `/repos/{owner}/{name}/releases/latest`
- Compute `weeklyStarDelta` by storing previous star counts
- Generate `editorialSummary` with a better prompt focused on "why developers should care"

### News Generation
- Optionally auto-generate news from significant repo changes (new release, star spike, etc.)
- Link news items to `repositories` via a `repositoryId` field

---

## 7. Safest Implementation Order

### Phase 1: Foundation (No Visual Changes, Zero Risk)
1. **Extract shared utilities** — `formatNumber`, `langColors`, `getBadge`, `badgeStyles`, `hashString`, `generateGradient` into `src/lib/utils.ts`
2. **Create shared loading skeleton component** — replace 6 identical spinners
3. **Remove dead code** — `convex-client-provider.tsx`, mock arrays (keep type interfaces)
4. **Remove dead nav links** — `/analyze` and `/discover` from `gitnews-feed.tsx`

### Phase 2: Backend Data Enrichment (Backend-Only, Frontend Unchanged)
5. **Add new optional fields to `repositories` schema** — additive migration, no breakage
6. **Enhance `syncGitHubData`** — fetch releases, compute deltas, generate editorial summaries
7. **Add `getRepoByOwnerName` query** — for the article page
8. **Improve `seedNews`** — add more diverse, current news items

### Phase 3: Feed Intelligence (Careful Component Updates)
9. **Fix `WhyTrending`** — accept real data props instead of hardcoded values
10. **Fix `GithubPulse`** — replace MOCK_EVENTS with live Convex data
11. **Fix `CompactRepoNewsCard`** — use real `weeklyStarDelta` instead of Math.random()
12. **Upgrade homepage** — remove duplicate nav, make left sidebar functional, fix right sidebar data
13. **Fix featured story** — use actual top-trending repo with real data instead of news[0] hack

### Phase 4: Article Page Upgrade
14. **Fix `RepoArticlePage`** — query `repositories` by owner/name, show real stats
15. **Add real AI analysis section** — use `editorialSummary` and `whyTrending` from backend
16. **Add real release info** — from `latestRelease` field

### Phase 5: Polish & New Features
17. **Add `/analyze` page** — repo comparison or deep-dive tool
18. **Improve loading states** — skeleton screens matching the actual layout
19. **Add error boundaries** — graceful fallbacks for failed Convex queries
20. **SEO meta tags** — per-page descriptions (partially done)
21. **Footer component** — site-wide footer
22. **Production build** — test and deploy

---

## 8. Risk Assessment

| Change | Risk | Mitigation |
|--------|------|-----------|
| Extract shared utils | 🟢 Zero | Pure refactor, no behavior change |
| Remove dead code | 🟢 Zero | Files are unused |
| Add schema fields (optional) | 🟢 Zero | Additive, existing rows unaffected |
| Enhance sync action | 🟡 Low | Add new data alongside existing — old queries still work |
| Update component props | 🟡 Low | Add optional props with fallbacks to current behavior |
| Restructure homepage layout | 🟡 Medium | Test each section independently before combining |
| Rewrite article page query | 🟡 Medium | New query + fallback to current behavior if no result |

---

## 9. Files Inventory

### Astro Pages (7 files)
| File | Lines | Purpose |
|------|-------|---------|
| `pages/index.astro` | 11 | Homepage shell |
| `pages/trending.astro` | 11 | Trending shell |
| `pages/ai.astro` | 11 | AI feed shell |
| `pages/news.astro` | 11 | News shell |
| `pages/live.astro` | 11 | Live pulse shell |
| `pages/repos/index.astro` | 11 | Repo browser shell |
| `pages/repos/[owner]/[name].astro` | 19 | Dynamic repo article (SSR) |

### React Islands (19 files)
| File | Lines | Convex? | Status |
|------|-------|---------|--------|
| `gitnews-feed.tsx` | 195 | ✅ | Needs refactor (fake data, duplicate nav) |
| `repo-card.tsx` | 301 | ❌ | Needs util extraction, good otherwise |
| `compact-repo-news-card.tsx` | 130 | ❌ | Needs real data, remove Math.random() |
| `trending-feed.tsx` | 99 | ✅ | Mostly good, slicing is arbitrary |
| `ai-feed.tsx` | 74 | ✅ | Good structure |
| `news-feed.tsx` | 66 | ✅ | Good structure |
| `news-card.tsx` | 75 | ❌ | Needs fix for repository mapping |
| `live-pulse-feed.tsx` | 140 | ✅ | Good, needs richer data |
| `repos-browser.tsx` | 64 | ✅ | Working, basic |
| `repo-article-page.tsx` | 160 | ✅ | Needs major data fix |
| `breaking-ticker.tsx` | 56 | ✅ | ✅ Just fixed |
| `theme-toggle.tsx` | 87 | ❌ | ✅ Just fixed |
| `theme-provider.tsx` | 19 | ❌ | Low impact, keep for now |
| `github-pulse.tsx` | 89 | ✅ | Needs real data |
| `analytics-visuals.tsx` | 94 | ❌ | ✅ Reusable utilities |
| `why-trending.tsx` | 52 | ❌ | Needs real data props |
| `search-filter.tsx` | 64 | ❌ | ✅ Generic, reusable |
| `mobile-menu.tsx` | 102 | ❌ | ✅ Working |
| `convex-client-provider.tsx` | 14 | ❌ | ❌ Dead code — remove |

### Backend (Key Files)
| File | Lines | Purpose |
|------|-------|---------|
| `schema.ts` | 181 | Database schema |
| `github.ts` | 401 | GitHub sync + queries + bookmarks |
| `news.ts` | 83 | News seed + query |

### Data Layer
| File | Lines | Purpose |
|------|-------|---------|
| `lib/convex.tsx` | 16 | Convex client singleton + withConvex HOC |
| `lib/data-mapper.ts` | 110 | DB row → frontend shape mappers |
| `data/repositories.ts` | 197 | Types + mock data (types used, mocks unused) |
| `data/news.ts` | 125 | Types + mock data (types used, mocks unused) |
| `data/liveSignals.ts` | 137 | Types + mock data (types used, mocks unused) |

---

## 10. Summary

The codebase has **strong visual bones** — the newspaper aesthetic, typography, dark mode, and component structure are solid. The Astro + React Islands architecture is correct for this use case.

The **critical weakness** is that the platform currently functions as a **repository listing** rather than a **developer intelligence platform**. The data layer lacks the fields needed to answer "why" and "what changed", the AI summaries are too shallow, and several components use `Math.random()` or hardcoded data to simulate intelligence they don't actually have.

The safest path forward is **bottom-up enrichment**: enrich the backend data first, then flow real intelligence into existing components via props — avoiding any visual regression while transforming the content from "here are repos" to "here's what matters and why."

---

## 11. Repository Intelligence Detail Pages Upgrade (Completed)

Transformed the `/repo/[owner]/[repo]` detail page into a premium developer magazine/Bloomberg Terminal-inspired research report.

**Architectural Changes:**
- Restructured `[repo].astro` layout into a responsive 2-column grid (`lg:grid-cols-[1fr_320px]`) with a sticky right sidebar.
- Kept data hydration server-side using existing Convex and Ollagraph integrations to ensure zero layout shift.

**New & Upgraded Components:**
- **RepoHeader (Upgraded):** Added status badges (Trending, Active Development, Rising), a redesigned Bento-style metrics grid, and prominent action buttons.
- **WhyWatching (New):** Replaced `WhyTrending` with large editorial cards detailing Growth Signal, Developer Adoption, and Why It Matters.
- **IntelligenceGrid (New):** Replaced `RepoScore` with a 6-card Bento layout mapping Overview, Learning Curve, Core Features, Best Use Cases, Future Potential, and Alternatives.
- **OllagraphDeepResearch (New):** Added a dedicated beta section mapping README analysis, docs insights, media research, and community sentiment.
- **DeveloperActivity (New):** Added a visual timeline component mapping recent releases, commits, and community PR/issue activity.
- **YoutubeLearningHub (New):** Integrated placeholder video cards for upcoming tutorial/deep-dive integrations.

**Next Steps (Ollagraph Roadmap):**
- Hydrate the `DeveloperActivity` timeline with live GitHub webhook/API data.
- Connect `YoutubeLearningHub` with YouTube Data API for dynamic video fetching based on repo name.

**Bug Fixes:**
- Replaced all instances of `className` with `class` across all new `.astro` components (`[repo].astro`, `RepoHeader.astro`, `WhyWatching.astro`, `IntelligenceGrid.astro`, `OllagraphDeepResearch.astro`, `DeveloperActivity.astro`, `YoutubeLearningHub.astro`) to fix the raw HTML rendering issue and ensure Tailwind CSS applies correctly.

---

## 12. Visual Asset System Upgrade (Completed)

Replaced placeholder emojis and static elements with a premium, centralized SVG and animation system.

**Packages Installed:**
- `@phosphor-icons/react`
- `@primer/octicons-react`
- `lottie-react`

**Assets Added:**
- Scaffolded asset directories: `src/assets/icons`, `src/assets/illustrations`, `src/assets/lottie`

**Components Upgraded:**
- **`GitNewsIcon.astro` (New):** A centralized Astro icon wrapper leveraging Phosphor and Octicons to ensure uniform iconography rendering across all server-rendered components.
- **`LottieAnimation.tsx` (New):** A robust client-side React Island for playing `.json` Lottie files without hydration mismatches.
- **`YoutubeCard.astro` (New):** Built a premium, glassmorphic YouTube learning card featuring thumbnails, custom play buttons, and AI-context badges.
- **`RepoHeader.astro` & `WhyWatching.astro` (Upgraded):** Refactored to completely replace legacy text emojis with scalable, themed SVG assets via `GitNewsIcon`.
