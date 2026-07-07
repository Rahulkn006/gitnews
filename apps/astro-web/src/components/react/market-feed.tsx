"use client";

import { useQuery } from "convex/react";
import { api } from "@v1/backend/convex/_generated/api";
import { mapConvexRepo } from "@/lib/data-mapper";
import { withConvex } from "@/lib/convex";
import { GithubMarketIndex } from "../intelligence/github-market-index";
import { BreakingTicker } from "./breaking-ticker";

export const MarketFeed = withConvex(function MarketFeed() {
  const dbRepos = useQuery(api.github.getTrendingRepos);

  if (dbRepos === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-[#0a0a0a]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
          <p className="text-slate-500 font-mono text-sm tracking-widest uppercase">Fetching Intelligence...</p>
        </div>
      </div>
    );
  }

  const repositories = dbRepos.map(mapConvexRepo);

  return (
    <div className="w-full min-h-screen bg-white text-slate-900 dark:bg-[#0a0a0a] dark:text-slate-200 font-sans selection:bg-emerald-500 selection:text-white">
      <BreakingTicker />
      
      <div className="max-w-[1500px] mx-auto px-4 md:px-6 lg:px-8 py-10 w-full">
        <h2 className="text-3xl font-serif font-black uppercase tracking-tight text-slate-900 dark:text-white border-b-2 border-black dark:border-white pb-4 mb-8">
          Open Source Market Index
        </h2>
        
        {/* We reuse the Market Index component but allow it to take more space */}
        <div className="bg-white dark:bg-[#0a0a0a] w-full mt-4">
          <GithubMarketIndex repositories={repositories} variant="dashboard" />
        </div>
      </div>
    </div>
  );
});
