# Convex Migration Analysis

## 1. Current Convex Files
The existing backend relies heavily on Convex Cloud, with the primary files located in `packages/backend/convex/`:
- `schema.ts`: Defines the database schema and collections.
- `github.ts`: Handles GitHub API integration, fetching trending repos, categorizing them, and invoking Together AI for summarization. Includes cron jobs.
- `news.ts`: Handles developer news queries and seeding.
- `crons.ts`: Contains scheduled tasks.
- `auth.ts`, `users.ts`, `apiKeys.ts`, `orgs.ts`, etc.: Authentication and multi-tenant logic.

## 2. Functions Being Used
### Queries:
- `api.github.getLatestRepos`
- `api.github.getTrendingRepos`
- `api.github.getFeaturedRepos`
- `api.github.getCategories`
- `api.github.getRepoDetails`
- `api.github.getRepoByOwnerAndName`
- `api.github.getReposByCategory`
- `api.github.getBookmarks`
- `api.news.getNews`

### Mutations/Actions:
- `api.github.bookmarkRepo`
- `api.github.removeBookmark`
- `api.github.toggleBookmark`
- `api.github.syncGitHubData` (internal action)
- `api.github.seedSampleRepositories`

## 3. Frontend Components Depending on Convex
The Astro and Next.js frontends have multiple React Islands and pages directly depending on Convex hooks (`useQuery`, `useMutation`, `useAction`). Key files include:
- `apps/astro-web/src/components/react/trending-feed.tsx`
- `apps/astro-web/src/components/react/news-feed.tsx`
- `apps/astro-web/src/components/react/live-pulse-feed.tsx`
- `apps/astro-web/src/components/react/ai-feed.tsx`
- `apps/astro-web/src/components/react/repos-browser.tsx`
- `apps/astro-web/src/components/react/market-feed.tsx`
- `apps/astro-web/src/components/react/repo-analysis.tsx`
- `apps/web/src/components/trending-section.tsx`
- `apps/web/src/components/news-section.tsx`
- `apps/web/src/app/page.tsx`
- ...and multiple dashboard components in `apps/app/`.

## 4. Database Collections
The Convex `schema.ts` defines several collections that will need to be replicated in PostgreSQL using Prisma:
- **`repositories`**: Central data store for GitHub repos, including AI summaries and developer analysis.
- **`categories`**: Tracks repository categories and tags.
- **`news`**: Developer news articles.
- **`bookmarks`**: User bookmarked repositories.
- **`users`**, **`workspaces`**, **`members`**, **`invites`**, **`notifications`**, **`apiKeys`**, **`usage`**, **`jobs`**, **`events`**, **`counters`**.

## 5. Migration Difficulty
**High.** 
The migration entails replacing a deeply integrated serverless database and function platform with a traditional monolithic backend. The primary challenge is maintaining the real-time functionality (which Convex handles natively) and swapping out `useQuery` hooks with standard REST API calls (or SWR/React Query hooks) without breaking the existing UI/UX.

## 6. Risk Areas
- **Real-time Updates**: Convex provides automatic reactivity. Replacing this with REST + Socket.IO (optional) might introduce synchronization issues or state management complexity on the frontend.
- **Data Synchronization Cron Job**: The `syncGitHubData` cron job handles critical fetching and AI processing. If the Node.js cron implementation fails or overlaps, it could lead to API rate limiting or duplicate data.
- **Authentication**: If Convex Auth is being used, migrating user sessions to the new backend could be complex and requires careful planning so users are not logged out or lose access.
- **Frontend Breaking**: Refactoring Convex hooks in Astro React islands and Next.js apps could cause hydration errors or layout shifts if data fetching states (loading/error) are not handled consistently.
