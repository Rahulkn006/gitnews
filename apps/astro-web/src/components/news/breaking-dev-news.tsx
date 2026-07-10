"use client";

import React from "react";
import { ShieldCheck } from "@phosphor-icons/react";
import { DEVELOPER_NEWS_DATA } from "@/data/developer-news";

interface BreakingDevNewsProps {
  repositories?: any[];
}

export function BreakingDevNews({ repositories = [] }: BreakingDevNewsProps) {
  if (!repositories.length) return null;

  // Generate dynamic live wire based on fast growers
  const liveWire = repositories
    .sort((a, b) => (b.growth24h || 0) - (a.growth24h || 0))
    .slice(0, 3)
    .map(r => ({
      id: r.id,
      icon: "🔥",
      headline: `${r.name} is rapidly climbing trending charts with +${r.growth24h || 0} stars today.`,
      source: "GitHub API",
      timestamp: "Live"
    }));

  // Generate new releases randomly from recently updated repos
  const latestReleases = repositories
    .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
    .slice(0, 4)
    .map(r => ({
      id: r.id,
      project: r.name,
      version: "Latest",
      signal: "UPDATED"
    }));

  return (
    <div className="flex flex-col gap-8 mt-6">
      {/* SECTION 1: LIVE DEV WIRE */}
      <div className="flex flex-col gap-0 border-t-2 border-black dark:border-white pt-2">
        <h3 className="font-serif font-black uppercase text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-2 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
          Live Dev Wire
        </h3>
        <div className="flex flex-col gap-3">
          {liveWire.map((news) => (
            <div key={news.id} className="flex flex-col gap-1 pb-3 border-b border-stone-200 dark:border-stone-800 last:border-0">
              <div className="flex items-start gap-2.5">
                <span className="text-sm shrink-0 mt-0.5">{news.icon}</span>
                <div className="flex flex-col gap-1 min-w-0">
                  <a href="#" className="font-bold text-sm text-slate-900 dark:text-white leading-tight hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors line-clamp-2">
                    {news.headline}
                  </a>
                  <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-500 uppercase tracking-widest mt-0.5">
                    <span className="truncate">{news.source}</span>
                    <span className="shrink-0">•</span>
                    <span className="shrink-0">{news.timestamp}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: NEW RELEASES */}
      <div className="flex flex-col gap-0 border-t-2 border-black dark:border-white pt-2">
        <h3 className="font-serif font-black uppercase text-sm tracking-tight text-slate-900 dark:text-white mb-3">
          Recently Active
        </h3>
        <div className="flex flex-col gap-1">
          {latestReleases.map((release) => (
            <div key={release.id} className="flex items-center justify-between py-2 border-b border-stone-100 dark:border-stone-800/50 last:border-0 group">
              <div className="flex flex-col min-w-0 pr-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                  {release.project}
                </span>
                <span className="text-[10px] font-mono text-slate-500 truncate mt-0.5">
                  {release.version}
                </span>
              </div>
              <span className="text-[9px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded shrink-0">
                {release.signal}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
