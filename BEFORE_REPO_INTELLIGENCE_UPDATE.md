# GitNews Safety Checkpoint - Before Repo Intelligence Phase 1

## Working Routes
- `/` - Homepage featuring GitNews feed, market widgets, and live pulse.
- `/repo/[owner]/[repo]` - Repository detail page (currently has mocked/placeholder sections for YouTube, Developer Activity, Ollagraph Deep Research).

## Current State of Target Files
- `src/pages/repo/[owner]/[repo].astro`: Main layout wrapper, currently loads `RepoHeader`, `WhyWatching`, `IntelligenceGrid`, `OllagraphDeepResearch`, `YoutubeLearningHub`, and `DeveloperActivity` (in the sticky right sidebar).
- `src/components/intelligence/YoutubeLearningHub.astro`: Hardcodes a mock array of 3 YouTube videos.
- `src/services/ollagraph.ts`: Exists, has a caching layer, and supports `analyzeRepository(owner, repo)` which returns mock AI data for unconfigured API keys, and real fetch data if endpoint is hit.

## Files that Will Change
1. `src/services/youtube.ts` (NEW): Will implement caching logic and fetch real videos based on repo data.
2. `src/components/intelligence/YoutubeLearningHub.astro` (MODIFIED): Will be converted to fetch real data via the new service.
3. `src/components/intelligence/RepoResearchSidebar.astro` (NEW): Will replace the empty space/placeholder sections on the right side of the repo detail page.
4. `src/pages/repo/[owner]/[repo].astro` (MODIFIED): Will incorporate `RepoResearchSidebar.astro` instead of just `DeveloperActivity.astro`.
5. `src/services/ollagraph.ts` (MODIFIED): Ensure it supports the correct signatures for README/release/community research with fallbacks.
6. `PROJECT_UPGRADE_PLAN.md` (MODIFIED): Update tasks.

## Design Identity Rules to Keep
- Bloomberg + HackerNews + GitHub newspaper theme.
- Dark mode & light mode support.
- Responsive for mobile & desktop.
- No blank spaces or placeholder content allowed.
