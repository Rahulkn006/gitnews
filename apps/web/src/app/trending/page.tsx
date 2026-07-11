"use client";

import { RepoCard } from "@/components/repo-card";
import { mapConvexRepo } from "@/lib/data-mapper";
import { api } from "@v1/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import Link from "next/link";

export default function TrendingPage() {
  const dbTrending = useQuery(api.github.getTrendingRepos);
  const dbFeatured = useQuery(api.github.getFeaturedRepos);
  const dbLatest = useQuery(api.github.getLatestRepos);

  if (
    dbTrending === undefined ||
    dbFeatured === undefined ||
    dbLatest === undefined
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-[#0a0a0a]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
          <p className="text-slate-500 font-mono text-sm tracking-widest uppercase">
            Fetching Intelligence...
          </p>
        </div>
      </div>
    );
  }

  const trendingToday = dbTrending.slice(0, 4).map(mapConvexRepo);
  const trendingThisWeek = dbTrending.slice(4, 10).map(mapConvexRepo);
  const fastestGrowing = dbLatest.slice(0, 6).map(mapConvexRepo);
  const mostStarred = dbFeatured.slice(0, 4).map(mapConvexRepo);

  return (
    <div className="w-full min-h-screen bg-stone-50 text-slate-900 dark:bg-[#0a0a0a] dark:text-slate-200 font-sans px-4 md:px-8 py-8 selection:bg-emerald-500 selection:text-white">
      {/* Magazine Banner Navigation */}
      <nav className="max-w-7xl mx-auto flex items-center justify-between mb-12 pb-6 border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="font-serif text-3xl font-black tracking-tighter text-slate-900 dark:text-white"
          >
            GitNews.
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500 dark:text-slate-400">
            <Link
              href="/trending"
              className="text-emerald-600 dark:text-emerald-400 font-bold"
            >
              Trending
            </Link>
            <Link
              href="/news"
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              News
            </Link>
            <Link
              href="/analyze"
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              Analyzer
            </Link>
            <Link
              href="/live"
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              Live Pulse
            </Link>
            <Link
              href="/ai"
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              AI
            </Link>
            <Link
              href="/discover"
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              Discover
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-5xl md:text-6xl font-serif font-black tracking-tight text-slate-900 dark:text-white mb-6">
            Trending Repositories
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl font-serif">
            See what the GitHub community is most excited about today.
          </p>
        </header>

        <div className="space-y-16">
          {/* Trending Today */}
          <section>
            <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-8 flex items-center gap-3 border-b border-stone-200 dark:border-stone-800 pb-4">
              <span className="w-2.5 h-2.5 bg-orange-500 rounded-sm" />
              Trending Today
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingToday.map((repo) => (
                <RepoCard key={repo.id} repo={repo} size="medium" />
              ))}
            </div>
          </section>

          {/* Trending This Week */}
          <section>
            <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-8 flex items-center gap-3 border-b border-stone-200 dark:border-stone-800 pb-4">
              <span className="w-2.5 h-2.5 bg-blue-500 rounded-sm" />
              Trending This Week
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {trendingThisWeek.map((repo) => (
                <RepoCard key={repo.id} repo={repo} size="medium" />
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Fastest Growing */}
            <section>
              <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-8 flex items-center gap-3 border-b border-stone-200 dark:border-stone-800 pb-4">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm" />
                Fastest Growing
              </h2>
              <div className="flex flex-col gap-4">
                {fastestGrowing.map((repo) => (
                  <RepoCard key={repo.id} repo={repo} size="small" />
                ))}
              </div>
            </section>

            {/* Most Starred */}
            <section>
              <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-8 flex items-center gap-3 border-b border-stone-200 dark:border-stone-800 pb-4">
                <span className="w-2.5 h-2.5 bg-yellow-500 rounded-sm" />
                Most Starred
              </h2>
              <div className="grid grid-cols-1 gap-6">
                {mostStarred.map((repo) => (
                  <RepoCard key={repo.id} repo={repo} size="medium" />
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
