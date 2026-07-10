"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../packages/backend/convex/_generated/api";
import { RepoCard } from "./repo-card";
import { mapConvexRepo } from "@/lib/data-mapper";
import { withConvex } from "@/lib/convex";

const TIME_FILTERS = [
  { id: "all", label: "All Time" },
  { id: "today", label: "Today" },
  { id: "week", label: "This Week" },
  { id: "month", label: "This Month" },
];

const CATEGORY_FILTERS = [
  "All",
  "AI",
  "Frontend",
  "Backend",
  "DevOps",
  "Database",
  "Security",
];

const SORT_OPTIONS = [
  { id: "score", label: "Trending Score" },
  { id: "growth", label: "Fastest Growing" },
  { id: "stars", label: "Most Starred" },
  { id: "updated", label: "Recently Updated" },
];

export const TrendingFeed = withConvex(function TrendingFeed() {
  const [time, setTime] = useState<string>("week");
  const [category, setCategory] = useState<string>("All");
  const [sort, setSort] = useState<string>("score");

  const dbTrending = useQuery(api.trending.getTrendingRepositories, {
    timeFilter: time === "all" ? undefined : time,
    category: category === "All" ? undefined : category,
    sort: sort,
  });
  
  const stats = useQuery(api.trending.getTrendingStats);

  return (
    <div className="w-full min-h-screen bg-stone-50 text-slate-900 dark:bg-[#0a0a0a] dark:text-slate-200 font-sans px-4 md:px-8 py-8 selection:bg-emerald-500 selection:text-white">
      <main className="max-w-7xl mx-auto">
        
        {/* Back Navigation */}
        <div className="mb-8">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors uppercase tracking-widest"
          >
            ← Back To Home
          </a>
        </div>

        {/* Header */}
        <header className="mb-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black tracking-tight text-slate-900 dark:text-white mb-4">
            TRENDING DEVELOPER INTELLIGENCE
          </h1>
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-3xl font-serif border-l-4 border-emerald-500 pl-4 py-1">
            Repositories gaining developer attention
          </p>
        </header>

        {/* Market Summary Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-white dark:bg-[#111] border border-stone-200 dark:border-stone-800 rounded-xl p-5 flex flex-col justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">Total Tracked Repos</span>
              <span className="text-2xl md:text-3xl font-black font-mono text-slate-800 dark:text-slate-200">{stats.totalTracked.toLocaleString()}</span>
            </div>
            <div className="bg-white dark:bg-[#111] border border-stone-200 dark:border-stone-800 rounded-xl p-5 flex flex-col justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">Trending Repositories</span>
              <span className="text-2xl md:text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">{stats.trendingCount.toLocaleString()}</span>
            </div>
            <div className="bg-white dark:bg-[#111] border border-stone-200 dark:border-stone-800 rounded-xl p-5 flex flex-col justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">Top Language</span>
              <span className="text-xl md:text-2xl font-black font-sans tracking-tight text-slate-800 dark:text-slate-200 truncate">{stats.topLanguage}</span>
            </div>
            <div className="bg-white dark:bg-[#111] border border-stone-200 dark:border-stone-800 rounded-xl p-5 flex flex-col justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">Hot Category</span>
              <span className="text-xl md:text-2xl font-black font-sans tracking-tight text-slate-800 dark:text-slate-200 truncate">{stats.hotCategory}</span>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-8 p-4 bg-white dark:bg-[#111] border border-stone-200 dark:border-stone-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mr-2">Category:</span>
            {CATEGORY_FILTERS.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                  category === cat
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    : "bg-stone-100 text-slate-600 hover:bg-stone-200 dark:bg-stone-900 dark:text-slate-400 dark:hover:bg-stone-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex items-center bg-stone-100 dark:bg-stone-900 rounded-lg p-1 mr-2 border border-stone-200 dark:border-stone-800">
               {TIME_FILTERS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTime(t.id)}
                  className={`px-3 py-1.5 rounded-md text-[10px] md:text-xs font-bold uppercase tracking-wider transition-colors ${
                    time === t.id
                      ? "bg-white text-slate-900 shadow-sm dark:bg-stone-800 dark:text-white"
                      : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-2 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              {SORT_OPTIONS.map((s) => (
                <option key={s.id} value={s.id}>
                  Sort by: {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Feed Content */}
        {dbTrending === undefined ? (
          // Loading Skeleton
          <div className="flex flex-col gap-6">
             {[1, 2, 3, 4, 5].map((i) => (
               <div key={i} className="animate-pulse flex gap-4 p-6 border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#111] rounded-xl">
                 <div className="w-12 h-12 bg-stone-200 dark:bg-stone-800 rounded-lg shrink-0"></div>
                 <div className="flex-1 space-y-3">
                   <div className="w-1/4 h-4 bg-stone-200 dark:bg-stone-800 rounded"></div>
                   <div className="w-3/4 h-6 bg-stone-200 dark:bg-stone-800 rounded"></div>
                   <div className="w-1/2 h-4 bg-stone-200 dark:bg-stone-800 rounded"></div>
                 </div>
               </div>
             ))}
          </div>
        ) : dbTrending.length === 0 ? (
          // Empty State
          <div className="py-20 text-center border border-dashed border-stone-300 dark:border-stone-800 rounded-xl">
             <div className="w-16 h-16 bg-stone-100 dark:bg-stone-900 rounded-full flex items-center justify-center mx-auto mb-4">
               <span className="text-2xl">🔍</span>
             </div>
             <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No trending repositories found</h3>
             <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
               We couldn't find any repositories matching your current filter criteria. Try selecting a different category or time range.
             </p>
             <button
                onClick={() => { setCategory("All"); setTime("all"); }}
                className="mt-6 px-4 py-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold rounded-lg text-sm transition-transform hover:scale-105"
             >
               Clear Filters
             </button>
          </div>
        ) : (
          // Success State
          <div className="flex flex-col gap-6">
            {dbTrending.map(mapConvexRepo).map((repo) => (
              <RepoCard key={repo.id} repo={repo} size="medium" />
            ))}
          </div>
        )}
      </main>
    </div>
  );
});
