"use client";

import { withConvex } from "@/lib/convex";
import { api } from "@v1/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import { BackNavigation } from "./back-navigation";

export const MarketFeed = withConvex(function MarketFeed() {
  const overview = useQuery(api.market.getMarketOverview);
  const techTrends = useQuery(api.market.getTechnologyTrends);
  const risingTools = useQuery(api.market.getRisingTools);
  const companyActivity = useQuery(api.market.getCompanyActivity);

  const isLoading =
    overview === undefined ||
    techTrends === undefined ||
    risingTools === undefined ||
    companyActivity === undefined;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-black">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
          <p className="text-slate-500 dark:text-emerald-500 font-mono text-sm tracking-widest uppercase">
            Fetching Intelligence...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white text-slate-900 dark:bg-black dark:text-emerald-500 font-sans selection:bg-emerald-500 selection:text-white">
      <div className="max-w-[1500px] mx-auto px-4 md:px-6 lg:px-8 py-10 w-full font-mono">
        {/* Back Navigation */}
        <div className="mb-6">
          <BackNavigation />
        </div>

        {/* Header */}
        <header className="mb-10 border-b-2 border-slate-900 dark:border-emerald-500 pb-6 flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-slate-900 dark:text-emerald-400">
              Developer Market Intelligence
            </h1>
            <p className="text-sm mt-2 text-slate-600 dark:text-emerald-700 uppercase tracking-widest">
              Live NASDAQ for the open-source ecosystem
            </p>
          </div>
          <div className="text-right text-xs font-bold text-slate-500 dark:text-emerald-600 uppercase">
            <span className="block">Status: Active</span>
            <span className="block">Updated: Just Now</span>
          </div>
        </header>

        {/* 6. AI Summary */}
        <div className="mb-12 bg-slate-100 dark:bg-[#050505] border border-slate-300 dark:border-emerald-900 p-6 rounded-sm">
          <h2 className="text-xs font-bold text-slate-500 dark:text-emerald-700 uppercase tracking-widest mb-3 border-b border-slate-300 dark:border-emerald-900 pb-2">
            Automated Market Insight
          </h2>
          <p className="text-lg font-serif dark:font-mono text-slate-800 dark:text-emerald-400">
            {overview.topCategory && overview.topCategory !== "N/A"
              ? `${overview.topCategory} repositories showed significant growth this week. `
              : ""}
            {overview.topLanguage && overview.topLanguage !== "N/A"
              ? `${overview.topLanguage} continues leading developer attention across tracked ecosystems. `
              : ""}
            Overall market tracking {overview.totalRepos} repositories with an
            average growth velocity of {overview.avgStarGrowth}.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-12">
            {/* 3. Developer Stock Market Style Cards */}
            <section>
              <h2 className="text-xl font-bold uppercase tracking-widest text-slate-900 dark:text-emerald-500 mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 animate-pulse" />
                Live Index
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {techTrends &&
                  Object.entries(techTrends).map(([tech, data]) => {
                    const isUp = data.weeklyGrowth >= 0;
                    return (
                      <div
                        key={tech}
                        className="bg-white dark:bg-black border border-slate-200 dark:border-emerald-900 p-4 shadow-sm hover:border-slate-400 dark:hover:border-emerald-500 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-bold uppercase tracking-wider text-slate-800 dark:text-emerald-300">
                            {tech}
                          </span>
                          <span
                            className={`text-sm font-bold ${isUp ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-500"}`}
                          >
                            {isUp ? "▲" : "▼"}{" "}
                            {data.weeklyGrowth > 0 ? "+" : ""}
                            {data.weeklyGrowth}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-emerald-700">
                          {data.totalRepos} Repos | {data.trendingScore} Score
                        </p>
                      </div>
                    );
                  })}
              </div>
            </section>

            {/* 4. Rising Developer Tools */}
            <section>
              <h2 className="text-xl font-bold uppercase tracking-widest text-slate-900 dark:text-emerald-500 mb-6 border-b border-slate-200 dark:border-emerald-900 pb-2">
                Rising Tools
              </h2>
              <div className="flex flex-col gap-3">
                {risingTools.map((repo, idx) => (
                  <div
                    key={repo.id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-emerald-900/50 hover:dark:border-emerald-500 transition-colors gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-2xl font-black text-slate-300 dark:text-emerald-900/50 w-8 text-center">
                        {idx + 1}
                      </div>
                      <div>
                        <a
                          href={`https://github.com/${repo.owner}/${repo.name}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-base font-bold text-slate-800 dark:text-emerald-400 hover:underline"
                        >
                          {repo.owner}/{repo.name}
                        </a>
                        <p className="text-xs text-slate-500 dark:text-emerald-600 mt-1 line-clamp-1">
                          {repo.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-slate-600 dark:text-emerald-500 shrink-0">
                      <div className="text-right">
                        <div className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-emerald-800">
                          Stars
                        </div>
                        <div className="font-bold">{repo.stars}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-emerald-800">
                          Language
                        </div>
                        <div className="font-bold">{repo.language}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-4 space-y-12">
            {/* 1. GitHub Market Overview */}
            <section className="bg-slate-900 dark:bg-[#050505] p-6 text-white dark:text-emerald-500 border border-slate-800 dark:border-emerald-700 shadow-xl">
              <h2 className="text-sm font-bold uppercase tracking-widest mb-6 text-slate-300 dark:text-emerald-400 border-b border-slate-700 dark:border-emerald-800 pb-2">
                Market Overview
              </h2>
              <div className="space-y-6">
                <div>
                  <div className="text-xs text-slate-400 dark:text-emerald-700 uppercase tracking-widest">
                    Total Repos Tracked
                  </div>
                  <div className="text-3xl font-black text-white dark:text-emerald-300">
                    {overview.totalRepos}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 dark:text-emerald-700 uppercase tracking-widest">
                    Average Star Growth
                  </div>
                  <div className="text-2xl font-bold text-emerald-400 dark:text-emerald-400">
                    +{overview.avgStarGrowth}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 dark:text-emerald-700 uppercase tracking-widest">
                    Most Active Language
                  </div>
                  <div className="text-lg font-bold text-white dark:text-emerald-300">
                    {overview.topLanguage}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 dark:text-emerald-700 uppercase tracking-widest">
                    Fastest Growing Category
                  </div>
                  <div className="text-lg font-bold text-white dark:text-emerald-300">
                    {overview.topCategory}
                  </div>
                </div>
              </div>
            </section>

            {/* 5. Company Open Source Activity */}
            <section>
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-emerald-500 mb-4 border-b border-slate-200 dark:border-emerald-900 pb-2">
                Corporate OSS Activity
              </h2>
              <div className="flex flex-col gap-3">
                {companyActivity.map((comp) => (
                  <div
                    key={comp.company}
                    className="p-4 bg-white dark:bg-black border border-slate-200 dark:border-emerald-900 hover:border-slate-400 dark:hover:border-emerald-600 transition-colors"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold uppercase text-slate-800 dark:text-emerald-400">
                        {comp.company}
                      </span>
                      <span className="text-xs font-bold bg-slate-100 dark:bg-emerald-900/30 text-slate-600 dark:text-emerald-500 px-2 py-1 rounded">
                        {comp.activeRepos} Repos
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-emerald-700 mb-2">
                      Total Stars:{" "}
                      <span className="font-bold text-slate-700 dark:text-emerald-500">
                        {comp.totalStars}
                      </span>
                    </div>
                    {comp.popularProjects.length > 0 && (
                      <div className="text-[10px] text-slate-400 dark:text-emerald-800 uppercase tracking-wider">
                        Top:{" "}
                        {comp.popularProjects
                          .map((p: any) => p.name)
                          .join(", ")}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
});
