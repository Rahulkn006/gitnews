"use client";

import { useQuery } from "convex/react";
import { api } from "@v1/backend/convex/_generated/api";

import { RepoCard } from "./repo-card";
import { mapConvexRepo } from "@/lib/data-mapper";
import { BreakingTicker } from "./breaking-ticker";
import { GithubPulse } from "./github-pulse";
import { GithubMarket } from "./github-market";
import { CompactRepoNewsCard } from "./compact-repo-news-card";
import { withConvex } from "@/lib/convex";
import { GithubMarketIndex } from "../intelligence/github-market-index";
import { DeveloperSignals } from "../intelligence/developer-signals";
import { CategoryLeaderboard } from "../intelligence/category-leaderboard";
import { WhyTrendingIntelligence } from "../intelligence/why-trending-intelligence";
import { BreakingDevNews } from "../news/breaking-dev-news";
import { ShouldLearnThis } from "../intelligence/should-learn-this";
import { OpportunityRadar } from "../intelligence/opportunity-radar";
import { LearningSignals } from "../intelligence/learning-signals";

export const GitNewsFeed = withConvex(function GitNewsFeed() {
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
  
  // Sorts
  const sortedByStars = [...repositories].sort((a: any, b: any) => (b.stars ?? 0) - (a.stars ?? 0));
  const sortedByGrowth = [...repositories].sort((a: any, b: any) => (b.weeklyGrowth ?? 0) - (a.weeklyGrowth ?? 0));

  // Segmentation
  const featuredStories = sortedByStars.slice(0, 2);
  const featuredIds = new Set(featuredStories.map(r => r.id));

  const leftRepos = sortedByGrowth.filter(r => !featuredIds.has(r.id)).slice(0, 6);
  const leftIds = new Set(leftRepos.map(r => r.id));

  const rightRepos = sortedByStars.filter(r => !featuredIds.has(r.id) && !leftIds.has(r.id)).slice(0, 6);
  const rightIds = new Set(rightRepos.map(r => r.id));

  const feedRepos = sortedByStars.filter(r => !featuredIds.has(r.id) && !leftIds.has(r.id) && !rightIds.has(r.id));

  // Determine metrics
  const reposAnalyzed = sortedByStars.length > 0 ? 543 : 0; 
  const trendingCount = sortedByStars.length;
  
  // Find hottest language
  const languageCounts = sortedByStars.reduce((acc: Record<string, number>, r) => {
    if (r.language) acc[r.language] = (acc[r.language] || 0) + 1;
    return acc;
  }, {});
  const hottestLanguage = Object.entries(languageCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'TypeScript';
  const hottestCategory = "Developer Tools";

  return (
    <div className="w-full min-h-screen bg-white text-slate-900 dark:bg-[#0a0a0a] dark:text-slate-200 font-sans selection:bg-emerald-500 selection:text-white">
      <BreakingTicker />
      
      <div className="max-w-[1500px] mx-auto px-4 md:px-6 lg:px-8 py-10">
        
        {/* Main Content Area: 3-Column Newspaper Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_300px] xl:grid-cols-[280px_1fr_340px] gap-8 xl:gap-12 pb-20 items-start">
          
          {/* LEFT COLUMN: Fastest Growing Repos & Market */}
          <aside className="w-full flex flex-col gap-8">
            <div className="flex flex-col gap-0 border-t-2 border-black dark:border-white">
              <div className="py-2 mb-2">
                 <h3 className="font-serif font-black uppercase text-lg tracking-tight text-slate-900 dark:text-white">
                   Fastest Growing
                 </h3>
                 <p className="text-xs text-slate-500 font-mono mt-1">High velocity projects</p>
              </div>
              
              <div className="flex flex-col gap-2 mt-4">
                {leftRepos.length > 0 ? leftRepos.map((repo, i) => (
                  <RepoCard key={repo.id || i} repo={repo} size="small" />
                )) : (
                  <div className="py-6 text-sm text-slate-500 font-mono text-center border-b border-stone-200 dark:border-stone-800">
                    Scanning for growth...
                  </div>
                )}
              </div>
            </div>

            {/* GitHub Market Ticker Widget */}
            <div className="mt-4">
              <GithubMarket repositories={repositories} />
            </div>

            {/* Breaking Developer News */}
            <BreakingDevNews />

            {/* Should I Learn This */}
            <div className="mt-8">
              <ShouldLearnThis />
            </div>

            {/* Developer Opportunity Radar */}
            <div className="mt-8">
              <OpportunityRadar />
            </div>

            {/* Learning Signals */}
            <div className="mt-8">
              <LearningSignals />
            </div>
          </aside>

          {/* MIDDLE COLUMN: Featured & Compact Feed */}
          <main className="flex-1 min-w-0">
            {/* Featured Stories */}
            <section className="mb-12">
              <div className="flex items-center justify-center gap-3 mb-8 pb-4 border-b-2 border-black dark:border-white">
                <span className="w-3 h-3 bg-slate-900 dark:bg-white rounded-sm rotate-45"></span>
                <h2 className="text-3xl font-serif font-black uppercase tracking-tight text-slate-900 dark:text-white">
                  Featured Stories
                </h2>
                <span className="w-3 h-3 bg-slate-900 dark:bg-white rounded-sm rotate-45"></span>
              </div>
              <div className="flex flex-col gap-8">
                {featuredStories.map(repo => (
                  <RepoCard key={repo.id} repo={repo} size="large" />
                ))}
              </div>
            </section>

            {/* Compact Newspaper Feed */}
            <section>
              <div className="flex items-center gap-3 mb-6 border-t border-stone-200 dark:border-stone-800 pt-6">
                <span className="w-2 h-2 bg-emerald-500 rounded-sm"></span>
                <h2 className="text-xl font-serif font-black uppercase tracking-tight text-slate-900 dark:text-white">
                  Trending Feed
                </h2>
              </div>
              <div className="flex flex-col gap-4">
                {(feedRepos.length > 0 ? feedRepos : sortedByStars).map((repo, i) => (
                  <CompactRepoNewsCard key={repo.id || i} repo={repo} />
                ))}
              </div>
            </section>
          </main>
          
          {/* RIGHT COLUMN: Developer Intelligence Widgets & Rising Stars */}
          <aside className="w-full flex flex-col gap-8">
            
            <div className="flex flex-col gap-6">
              {/* Compact Daily Intelligence Widget */}
              <div className="border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#111] p-5 rounded-xl shadow-sm">
                <h4 className="font-mono text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Daily Intelligence
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xl font-serif font-black text-slate-900 dark:text-white">{reposAnalyzed}</div>
                    <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mt-0.5">Analyzed</div>
                  </div>
                  <div>
                    <div className="text-xl font-serif font-black text-emerald-600 dark:text-emerald-400">{trendingCount}</div>
                    <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mt-0.5">Trending</div>
                  </div>
                  <div>
                    <div className="text-sm font-bold font-sans text-slate-900 dark:text-white truncate">{hottestLanguage}</div>
                    <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mt-0.5">Top Language</div>
                  </div>
                  <div>
                    <div className="text-sm font-bold font-sans text-purple-600 dark:text-purple-400 truncate">{hottestCategory}</div>
                    <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mt-0.5">Hot Category</div>
                  </div>
                </div>
              </div>

              {/* Rising Stars Feed */}
              <div className="border-t-2 border-black dark:border-white pt-2 mt-2">
                <h3 className="font-serif font-black uppercase text-lg tracking-tight text-slate-900 dark:text-white mb-1">
                  Rising Stars
                </h3>
                <p className="text-xs text-slate-500 font-mono mb-4">Gaining community traction</p>
                <div className="flex flex-col gap-2">
                  {rightRepos.length > 0 ? rightRepos.map((repo, i) => (
                    <RepoCard key={repo.id || i} repo={repo} size="small" />
                  )) : (
                    <div className="py-6 text-sm text-slate-500 font-mono text-center border border-dashed border-stone-200 dark:border-stone-800 rounded-lg">
                      Scanning...
                    </div>
                  )}
                </div>
              </div>

              {/* GitHub Market Index */}
              <GithubMarketIndex repositories={repositories} />
              
              {/* Developer Signals */}
              <DeveloperSignals />
              
              {/* Category Leaderboard */}
              <CategoryLeaderboard />
              
              {/* Why Trending Intelligence */}
              <WhyTrendingIntelligence />
            </div>

          </aside>
          
        </div>
      </div>
    </div>
  );
});
