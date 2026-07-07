# GitNews - Project Progress & Architecture Report

This file documents the complete architectural transformation of the GitNews platform from a basic Convex template into a premium, live-data connected GitHub + AI discovery tech magazine.

---

## 1. Project Overview & Main Goal
Transform a template project into **GitNews**: a premium tech magazine editorial interface showcasing trending GitHub repositories, new AI projects, machine learning launches, and technology news briefs, connected directly to a live Convex backend and styled with a dark, monospace code-accented aesthetic.

---

## 2. Technical Architecture & Data Schema

### Convex Backend Tables
- **`repositories`**: Stores live repository details synced from GitHub Search APIs.
  - Fields: `name`, `owner`, `avatar`, `description`, `stars`, `forks`, `language`, `category`, `topics`, `createdAt`, `updatedAt`, `trendingScore`, `aiSummary`, `repoUrl`, `readme`.
- **`news`**: Stores aggregated technology news wire dispatches.
  - Fields: `title`, `source`, `summary`, `category`, `date`, `url`, `createdAt`.
- **`categories`**: Tracks sectors (AI Agents, LLM Tools, Dev Tools, Infrastructure, Machine Learning).

### Live Backend Functions
- **`github:syncGitHubData` (internal action)**: Fetches trending & active repository data via GitHub Search API endpoints, runs Together AI neural models to produce concise developer intelligence summaries (`aiSummary`), and saves results to `repositories`.
- **`news:seedNews` (mutation)**: Seeds high-quality tech dispatches matching the print magazine style into the database.
- **`news:getNews` (query)**: Serves live news items.
- **`github:getTrendingRepos` (query)**: Serves live sorted repository listings.

---

## 3. Frontend Layout Implementations

### Homepage Bento Grid Layout (`apps/web/src/app/page.tsx`)
- **Header**: Large monospace text banner displaying "THE DEVELOPER DAILY" and "GITNEWS".
- **"Today's Picks"**: A Bento grid layout featuring:
  - **Large Featured Card**: Highlight for the top-rated project, rendering avatar, statistics, language dot, and expandable README preview.
  - **Medium Cards**: Side-by-side cards for secondary trending projects.
  - **Small Cards**: Vertical column for quick discoverable items.
- **"Yesterday's Highlights"**: Holds a grid segment of secondary trending logs.
- **AI News Sidebar**: Displays live chronicle dispatches parsed by neural models.

### Standalone AI News Magazine (`apps/web/src/app/news/page.tsx`)
- Distinct route dedicated strictly to chronicle dispatches, separating news articles from the main repository bento flows.
- Styled as a print newspaper magazine cover story layout.

---

## 4. How to Run & Verify the Platform

### Local Development Start
To run with hot-reloads:
```bash
# Start Next.js development server on port 3001
bun run dev:web
```

### Production Build & Run (Recommended)
To run pre-compiled optimized assets and avoid hot-reload 404 caching bugs:
```bash
# Build all workspaces
bun run build

# Start Next.js production server
cd apps/web && bun run start -p 3001 --hostname 0.0.0.0
```

### Backend Database Syncs
To trigger new sync loops manually:
```bash
# Seed news stories
npx convex run news:seedNews

# Trigger GitHub Search API & AI summarization sync
npx convex run github:syncGitHubData
```
