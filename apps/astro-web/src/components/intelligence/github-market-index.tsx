"use client";

import React from "react";
import { formatNumber } from "@/lib/utils";
import { GITHUB_MARKET_DATA } from "@/data/github-market-index";

interface GithubMarketIndexProps {
  repositories?: any[];
  variant?: "sidebar" | "dashboard";
}

export function GithubMarketIndex({ repositories, variant = "sidebar" }: GithubMarketIndexProps) {
  // Use real data if available, otherwise fallback to mock data architecture
  const data = GITHUB_MARKET_DATA;

  // Calculate some real data from repositories if possible, otherwise rely on mock
  // For this initial version, as requested, we mix in some real repository data if present
  let realMovers = data.movers;
  if (repositories && repositories.length > 0) {
    const calculatedMovers = [...repositories]
      .sort((a, b) => (b.weeklyGrowth || 0) - (a.weeklyGrowth || 0))
      .slice(0, 3)
      .map(r => ({
        name: r.name,
        stars: r.weeklyGrowth || 0,
        trend: "up"
      }));
      
    if (calculatedMovers.length > 0 && calculatedMovers[0].stars > 0) {
       realMovers = calculatedMovers;
    }
  }

  return (
    <div className={`flex flex-col gap-6 mt-6 border-t-2 border-black dark:border-white pt-6 ${variant === 'dashboard' ? 'w-full' : ''}`}>
      <div className="mb-0">
         <h3 className={`font-serif font-black uppercase tracking-tight text-slate-900 dark:text-white flex items-center gap-2 ${variant === 'dashboard' ? 'text-2xl' : 'text-lg'}`}>
           GITHUB MARKET INDEX
         </h3>
      </div>
      
      <div className={variant === 'dashboard' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 w-full' : 'flex flex-col gap-6'}>

      {/* SECTION 1: GitHub Market Today */}
      <div className="flex flex-col gap-3">
        <h4 className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-stone-200 dark:border-stone-800 pb-1">
          GitHub Market
        </h4>
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          {data.categories.map((cat, i) => (
            <div key={i} className="flex flex-col">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-200">{cat.name}</span>
              <span className={`text-[11px] font-mono font-bold ${cat.trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {cat.trend === 'up' ? '▲' : '▼'} {cat.growth > 0 ? '+' : ''}{cat.growth}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: Language Movement */}
      <div className="flex flex-col gap-3">
        <h4 className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-stone-200 dark:border-stone-800 pb-1">
          Language Index
        </h4>
        <div className="flex flex-col gap-2.5">
          {data.languages.map((lang, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <div className="flex justify-between items-end">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-200">{lang.name}</span>
                <span className="text-[10px] font-mono text-slate-500">{lang.percentage}%</span>
              </div>
              <div className="w-full bg-stone-100 dark:bg-stone-800 h-1.5 rounded-none overflow-hidden">
                <div 
                  className="bg-slate-900 dark:bg-slate-300 h-full rounded-none" 
                  style={{ width: `${lang.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: Developer Attention */}
      <div className="flex flex-col gap-3">
        <h4 className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-stone-200 dark:border-stone-800 pb-1">
          Attention Score
        </h4>
        <div className="flex flex-col border border-stone-200 dark:border-stone-800 p-3 bg-stone-50 dark:bg-[#111]">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-slate-900 dark:text-slate-200">{data.attentionScore.category}</span>
            <span className="text-lg font-serif font-black text-emerald-600 dark:text-emerald-400">{data.attentionScore.score}/100</span>
          </div>
          <p className="text-[10px] text-slate-500 font-mono leading-relaxed">
            Reason:<br/>
            "{data.attentionScore.reason}"
          </p>
        </div>
      </div>

      {/* SECTION 4: Market Movers */}
      <div className="flex flex-col gap-3">
        <h4 className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-stone-200 dark:border-stone-800 pb-1">
          Fast Movers
        </h4>
        <div className="flex flex-col gap-2">
          {realMovers.map((mover, i) => (
            <div key={i} className="flex justify-between items-center py-1.5 border-b border-stone-100 dark:border-stone-800/50 last:border-0">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-200 truncate pr-2 flex items-center gap-1.5">
                <span className="text-[9px] text-emerald-600 dark:text-emerald-400">▲</span>
                {mover.name}
              </span>
              <span className="text-[10px] font-mono text-slate-500 shrink-0">
                +{formatNumber(mover.stars)} stars
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 5: Daily Open Source Pulse */}
      <div className="flex flex-col gap-3">
        <h4 className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-stone-200 dark:border-stone-800 pb-1">
          Today
        </h4>
        <div className="grid grid-cols-1 gap-1 text-xs font-mono">
          <div className="flex justify-between items-center py-1.5">
            <span className="text-slate-500">Repositories scanned:</span>
            <span className="font-bold text-slate-900 dark:text-slate-200">{formatNumber(data.dailyPulse.scanned)}</span>
          </div>
          <div className="flex justify-between items-center py-1.5 border-t border-stone-100 dark:border-stone-800/50">
            <span className="text-slate-500">Trending projects:</span>
            <span className="font-bold text-slate-900 dark:text-slate-200">{data.dailyPulse.trending}+</span>
          </div>
          <div className="flex flex-col gap-1 py-1.5 border-t border-stone-100 dark:border-stone-800/50">
            <span className="text-slate-500">Hot categories:</span>
            <span className="font-bold text-slate-900 dark:text-slate-200">{data.dailyPulse.categories.join(", ")}</span>
          </div>
        </div>
      </div>
      
      </div>
    </div>
  );
}
