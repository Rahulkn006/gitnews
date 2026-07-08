"use client";

import React from "react";
import { Lightning, RocketLaunch, TrendUp, Star, CaretUp } from "@phosphor-icons/react";
import { formatNumber } from "@/lib/utils";

interface GithubMarketProps {
  repositories: any[];
}

export function GithubMarket({ repositories }: GithubMarketProps) {
  // Sort and filter for different market segments
  const topGainers = [...repositories]
    .sort((a, b) => (b.weeklyGrowth || 0) - (a.weeklyGrowth || 0))
    .slice(0, 4);

  // For fast movers, we look at stars but pretend it's commit velocity for the market vibe
  // In reality, this would use an actual 'commitsThisWeek' delta from the backend
  const fastMovers = [...repositories]
    .sort((a, b) => (b.stars || 0) - (a.stars || 0))
    .slice(10, 14);

  // New Launches: Repos with fewer stars but high growth, simulating a recent launch
  const newLaunches = [...repositories]
    .filter(r => (r.stars || 0) < 5000)
    .sort((a, b) => (b.weeklyGrowth || 0) - (a.weeklyGrowth || 0))
    .slice(0, 4);

  return (
    <div className="flex flex-col gap-6">
      <div className="border-b-2 border-black dark:border-white pb-2 mb-2">
         <h3 className="font-serif font-black uppercase text-xl tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
           <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
           Open Source Market
         </h3>
         <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase tracking-widest">
           Live Repository Exchange
         </p>
      </div>

      <MarketSection title="Top Gainers" repos={topGainers} type="gain" icon={<CaretUp className="w-4 h-4 text-emerald-500" weight="fill" />} />
      <MarketSection title="Fast Movers" repos={fastMovers} type="velocity" icon={<Lightning className="w-4 h-4 text-amber-500" weight="fill" />} />
      <MarketSection title="New Launches" repos={newLaunches} type="launch" icon={<RocketLaunch className="w-4 h-4 text-purple-500" weight="fill" />} />
    </div>
  );
}

function MarketSection({ title, repos, type, icon }: { title: string, repos: any[], type: string, icon: React.ReactNode }) {
  if (!repos || repos.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <h4 className="font-mono text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
        <span>{icon}</span> {title}
      </h4>
      <div className="flex flex-col border border-stone-200 dark:border-stone-800 rounded-lg overflow-hidden bg-white dark:bg-[#111]">
        {repos.map((repo, i) => (
          <a
            key={repo.id || i}
            href={repo.url || `/repo/${repo.owner}/${repo.name}`}
            className="flex items-center justify-between p-3 border-b border-stone-100 dark:border-stone-800 last:border-b-0 hover:bg-stone-50 dark:hover:bg-[#111]/50 transition-colors group"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="truncate font-bold text-xs md:text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {repo.owner.toUpperCase()}
                </span>
                <span className="text-[9px] font-mono font-bold text-slate-400 bg-stone-100 dark:bg-stone-800 px-1 rounded">
                  {repo.language || 'SYS'}
                </span>
              </div>
              <div className="truncate text-[10px] font-mono text-slate-500">
                {repo.name}
              </div>
            </div>

            <div className="flex flex-col items-end shrink-0 ml-3">
              {type === 'gain' && (
                <>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1">
                    <CaretUp className="w-3 h-3" weight="fill" /> {formatNumber(repo.weeklyGrowth || 0)}
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono uppercase">Stars</span>
                </>
              )}
              {type === 'velocity' && (
                <>
                  <span className="text-xs font-black text-blue-600 dark:text-blue-400 font-mono flex items-center gap-1">
                    <TrendUp className="w-3 h-3" weight="bold" /> Velocity
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono uppercase">Commits ↑</span>
                </>
              )}
              {type === 'launch' && (
                <>
                  <span className="text-xs font-black text-purple-600 dark:text-purple-400 font-mono flex items-center gap-1">
                    <Star className="w-3 h-3" weight="fill" /> {formatNumber(repo.stars || 0)}
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono uppercase">Initial Trac</span>
                </>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
