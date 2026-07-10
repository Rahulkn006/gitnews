# Phase 3 Migration Report: Database Migration to Self-Hosted Backend

This document details the successful completion of Phase 3, successfully detaching the backend logic from Convex Cloud and shifting to a self-hosted PostgreSQL database using Prisma ORM.

## Files Created & Updated

- **`apps/backend/prisma/schema.prisma`**: Developed a fully mirrored relational schema mapping Convex's NoSQL structure into Prisma.
- **`apps/backend/src/database/repository.database.ts`**: The database access layer responsible for PostgreSQL reads and writes for the `Repository` model.
- **`apps/backend/src/database/analysis.database.ts`**: The data access layer for interacting with the `RepositoryAnalysis` model.
- **`apps/backend/src/services/github.service.ts` & `together.service.ts`**: Updated to route persistent data directly through the Prisma Database layer instead of Convex Cloud.
- **`apps/backend/src/routes/repositories.routes.ts`**: Implemented API logic to query the database.
- **`apps/backend/src/server.ts`**: Hooked in the `POST /api/sync/github` endpoint to manually trigger the node-cron logic.

## Convex Features Replaced

1. **Database Schema (`convex/schema.ts`)**: The Convex tables have been fully replicated in Prisma PostgreSQL models (`Repository`, `RepositoryAnalysis`, `Category`, `NewsItem`, and `Cache`).
2. **Data Storage Mechanism**: Replaced `ctx.db.insert`/`ctx.db.patch` with Prisma's `prisma.upsert`/`prisma.create` flows.
3. **Cron Scheduler (`convex/crons.ts`)**: Convex scheduled jobs were replaced by a `node-cron` instance configured natively inside the backend, preserving the hourly trigger interval.

## Database Structure

The Prisma PostgreSQL database utilizes strong relational modeling while preserving the exact data capabilities of Convex:
- **`Repository`**: Stores repository metadata (stars, forks, description).
- **`RepositoryAnalysis`**: Features a 1:1 relation to `Repository` via `repositoryId` to store detailed AI findings.
- **`Category`**: Normalizes repository topics and counts.
- **`NewsItem`**: Captures platform news, linked to repositories.

## API Endpoints

The following REST API endpoints are fully functional and successfully proxy Prisma queries:
- `GET /api/repositories`: Fetches the trending repositories (matches `getTrendingRepos` from Convex).
- `GET /api/repositories/:owner/:repo`: Fetches complete repo details (matches `getRepoDetails`).
- `GET /api/repositories/:owner/:repo/analysis`: Fetches isolated AI analysis insights for the repository.
- `POST /api/sync/github`: Allows administrators to manually spawn the background sync operation.

## Remaining Phase 4 Frontend Switching Tasks

Currently, the Astro UI still fetches data from `limitless-kiwi-886.convex.cloud`. During Phase 4, the frontend must be decoupled from Convex and wired to the new API endpoints.

**Phase 4 To-Do List:**
- Update `apps/astro-web` and React Islands (`useQuery` hooks) to standard HTTP fetch logic pointing to `http://localhost:3001/api/...`.
- Implement `SWR` or `React Query` inside React islands to replace the realtime cache and optimistic UI features of `useQuery`.
- Adjust `data-mapper.ts` inside Astro to map the new REST JSON formats if there are any subtle type differences.
- Safely uninstall `@convex-dev` libraries from the frontend.
