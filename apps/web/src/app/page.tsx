"use client";

import { BreakingTicker } from "@/components/breaking-ticker";
import { CompactRepoNewsCard } from "@/components/compact-repo-news-card";
import { GithubPulse } from "@/components/github-pulse";
import { RepoCard } from "@/components/repo-card";
import { mapConvexNews, mapConvexRepo } from "@/lib/data-mapper";
import { api } from "@v1/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import Link from "next/link";

export default function Page() {
  // Fetch real data from Convex queries
  const dbRepos = useQuery(api.github.getTrendingRepos);
  const dbNews = useQuery(api.news.getNews);

  // Show loading state if data hasn't loaded yet
  if (dbRepos === undefined || dbNews === undefined) {
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

  const repositories = dbRepos.map(mapConvexRepo);
  const news = dbNews.map(mapConvexNews);

  // Sort and segment repositories
  const sortedRepos = [...repositories].sort(
    (a: any, b: any) => (b.stars ?? 0) - (a.stars ?? 0),
  );

  // Use first news story as the single featured repo card
  const featuredStory = news.length > 0 ? news[0] : null;

  // Use remaining repos for the high-density feed
  const feedRepos = sortedRepos.slice(0, 15);

  const formatDate = () => {
    const d = new Date();
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const safeDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "Recent";
      return d.toLocaleDateString();
    } catch {
      return "Recent";
    }
  };

  return (
    <div className="w-full min-h-screen bg-white text-slate-900 dark:bg-[#0a0a0a] dark:text-slate-200 font-sans selection:bg-emerald-500 selection:text-white">
      <BreakingTicker />

      {/* Magazine Banner Navigation */}
      <div className="px-4 md:px-8 pt-8">
        <nav className="max-w-[1600px] mx-auto flex items-center justify-between mb-8 pb-4 border-b-2 border-black dark:border-white">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="font-serif text-4xl font-black tracking-tighter text-slate-900 dark:text-white"
            >
              GitNews.
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm font-bold text-slate-900 dark:text-slate-200 uppercase tracking-widest">
              <Link
                href="/trending"
                className="hover:text-emerald-600 transition-colors"
              >
                Trending
              </Link>
              <Link
                href="/news"
                className="hover:text-emerald-600 transition-colors"
              >
                News
              </Link>
              <Link
                href="/analyze"
                className="hover:text-emerald-600 transition-colors"
              >
                Analyzer
              </Link>
              <Link
                href="/live"
                className="hover:text-emerald-600 transition-colors"
              >
                Live
              </Link>
              <Link
                href="/ai"
                className="hover:text-emerald-600 transition-colors"
              >
                AI
              </Link>
              <Link
                href="/discover"
                className="hover:text-emerald-600 transition-colors"
              >
                Discover
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500 font-bold uppercase tracking-widest">
            <span>{formatDate()}</span>
          </div>
        </nav>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 pb-20 flex gap-8 md:gap-12">
        <aside className="hidden lg:flex w-48 xl:w-56 flex-col gap-2 flex-shrink-0 sticky top-8 h-fit">
          <div className="flex items-center gap-2 px-5 py-2.5 bg-orange-100 dark:bg-orange-950/30 text-orange-600 dark:text-orange-500 rounded-full font-bold mb-4 w-max text-sm md:text-base">
            Popular
          </div>
          <div className="flex flex-col gap-1">
            {[
              "Technology",
              "Open Source",
              "AI Developer News",
              "Frontend",
              "Backend",
              "Security",
              "DevOps",
            ].map((cat) => (
              <button
                key={cat}
                className="text-left px-5 py-3 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold hover:bg-stone-100 dark:hover:bg-stone-900 rounded-full transition-colors text-lg md:text-xl"
              >
                {cat}
              </button>
            ))}
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          {/* Featured Repository (Large Editorial Story) */}
          {featuredStory && (
            <section className="mb-8 border-b border-stone-200 dark:border-stone-800 pb-8">
              <RepoCard
                repo={{
                  owner: featuredStory.repository.split("/")[0] || "github",
                  name:
                    featuredStory.repository.split("/")[1] ||
                    featuredStory.repository,
                  description: featuredStory.explanation,
                  stars: 125000,
                  forks: 10000,
                  weeklyGrowth: 2500,
                  aiSummary: featuredStory.headline,
                  language: "TypeScript",
                  topics: ["framework", "react", "frontend"],
                  rank: 1,
                  avatar: `https://github.com/${featuredStory.repository.split("/")[0] || "github"}.png`,
                }}
                size="large"
              />
            </section>
          )}

          {/* High-Density Compact Feed */}
          <section className="mb-20">
            <div className="flex items-center mb-6">
              <h2 className="text-xl font-serif font-black uppercase tracking-tight text-slate-900 dark:text-white">
                Today's Repository Stories
              </h2>
            </div>

            <div className="flex flex-col gap-4">
              {feedRepos.map((repo, i) => (
                <CompactRepoNewsCard key={repo.id || i} repo={repo} />
              ))}
            </div>
          </section>
        </main>

        {/* Right Sidebar - Developer Intelligence */}
        <aside className="hidden xl:flex w-72 flex-col gap-10 flex-shrink-0 sticky top-8 h-fit">
          {/* Top 10 Repos Today */}
          <div className="border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#111]">
            <div className="bg-stone-100 dark:bg-stone-900 px-4 py-2 border-b border-stone-200 dark:border-stone-800">
              <h4 className="font-mono text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                Trending Today
              </h4>
            </div>
            <div className="p-4 flex flex-col gap-4">
              {feedRepos.slice(0, 5).map((r, i) => (
                <Link
                  href={`/repo/${r.owner}/${r.name}`}
                  key={r.id}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-5 h-5 rounded-sm bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center font-bold text-xs">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-bold text-sm text-slate-700 dark:text-slate-300 group-hover:text-emerald-600 transition-colors">
                      {r.name}
                    </div>
                  </div>
                  <div className="text-xs font-mono text-emerald-600">
                    +{Math.floor(Math.random() * 500 + 100)}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <GithubPulse />

          {/* Repository Releases */}
          <div className="border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#111] p-4">
            <h4 className="font-mono text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-4 border-b border-stone-100 dark:border-stone-800 pb-2">
              Repository Releases
            </h4>
            <div className="flex flex-col gap-4">
              <div className="group cursor-pointer">
                <span className="text-[10px] text-purple-500 font-bold tracking-widest uppercase mb-1 block">
                  Next.js 15 RC
                </span>
                <h5 className="font-bold text-sm text-slate-700 dark:text-slate-300 group-hover:text-purple-500 transition-colors">
                  React Compiler update shipped
                </h5>
              </div>
              <div className="group cursor-pointer">
                <span className="text-[10px] text-emerald-500 font-bold tracking-widest uppercase mb-1 block">
                  TailwindCSS v4.0
                </span>
                <h5 className="font-bold text-sm text-slate-700 dark:text-slate-300 group-hover:text-emerald-500 transition-colors">
                  New CSS-only engine alpha
                </h5>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
