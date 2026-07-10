"use client";

import React from "react";
import { formatNumber } from "@/lib/utils";

interface GithubMarketIndexProps {
  repositories?: any[];
  variant?: "sidebar" | "dashboard";
}

export function GithubMarketIndex({ repositories, variant = "sidebar" }: GithubMarketIndexProps) {
  if (!repositories || repositories.length === 0) {
    return (
      <div className={`flex flex-col gap-6 mt-6 border-t-2 border-black dark:border-white pt-6 ${variant === 'dashboard' ? 'w-full' : ''}`}>
        <div className="mb-0">
           <h3 className={`font-serif font-black uppercase tracking-tight text-slate-900 dark:text-white flex items-center gap-2 ${variant === 'dashboard' ? 'text-2xl' : 'text-lg'}`}>
             GITHUB MARKET INDEX
           </h3>
        </div>
        <div className="py-6 text-sm text-slate-500 font-mono text-center border border-dashed border-stone-200 dark:border-stone-800 rounded-lg">
           Calculating market index...
        </div>
      </div>
    );
  }

  // Calculate Real Movers
  const realMovers = [...repositories]
    .sort((a, b) => (b.growth24h || 0) - (a.growth24h || 0))
    .slice(0, 3)
    .map(r => ({
      name: r.name,
      stars: r.growth24h || 0,
      trend: "up"
    }));

  // Calculate Real Categories based on velocityScore or growth
  const categoryGroups = repositories.reduce((acc: any, r: any) => {
    if (r.category) {
      if (!acc[r.category]) acc[r.category] = { count: 0, growth: 0 };
      acc[r.category].count += 1;
      acc[r.category].growth += (r.growth24h || 0);
    }
    return acc;
  }, {});

  const categories = Object.entries(categoryGroups)
    .map(([name, data]: any) => ({
      name,
      growth: data.count > 0 ? Math.round(data.growth / data.count) : 0, // avg growth per repo
      trend: (data.count > 0 && data.growth > 0) ? "up" : "down"
    }))
    .sort((a, b) => b.growth - a.growth)
    .slice(0, 4);

  // Calculate Language Index
  const languageGroups = repositories.reduce((acc: any, r: any) => {
    if (r.language) {
      acc[r.language] = (acc[r.language] || 0) + 1;
    }
    return acc;
  }, {});
  
  const totalWithLang = Object.values(languageGroups).reduce((sum: any, count: any) => sum + count, 0) as number;
  
  const languages = Object.entries(languageGroups)
    .map(([name, count]: any) => ({
      name,
      percentage: totalWithLang > 0 ? Math.round((count / totalWithLang) * 100) : 0
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 4);

  // Determine top category for attention
  const topCategory = categories[0]?.name || "Technology";
  const attentionScore = {
    category: topCategory,
    score: Math.min(100, Math.round(50 + (categories[0]?.growth || 0) / 2)),
    reason: `${topCategory} continues to dominate new star creation and developer activity this week.`
  };

  // Daily Pulse
  const dailyPulse = {
    scanned: repositories.length,
    trending: repositories.filter(r => r.growth24h && r.growth24h > 10).length,
    categories: categories.slice(0, 2).map(c => c.name)
  };

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
          {categories.map((cat, i) => (
            <div key={i} className="flex flex-col">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-200">{cat.name}</span>
              <span className={`text-[11px] font-mono font-bold ${cat.trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {cat.trend === 'up' ? '▲' : '▼'} {cat.growth > 0 ? '+' : ''}{cat.growth} avg stars
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
          {languages.map((lang, i) => (
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
            <span className="text-sm font-bold text-slate-900 dark:text-slate-200">{attentionScore.category}</span>
            <span className="text-lg font-serif font-black text-emerald-600 dark:text-emerald-400">{attentionScore.score}/100</span>
          </div>
          <p className="text-[10px] text-slate-500 font-mono leading-relaxed">
            Reason:<br/>
            "{attentionScore.reason}"
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
            <span className="font-bold text-slate-900 dark:text-slate-200">{formatNumber(dailyPulse.scanned)}</span>
          </div>
          <div className="flex justify-between items-center py-1.5 border-t border-stone-100 dark:border-stone-800/50">
            <span className="text-slate-500">Trending projects:</span>
            <span className="font-bold text-slate-900 dark:text-slate-200">{dailyPulse.trending}+</span>
          </div>
          <div className="flex flex-col gap-1 py-1.5 border-t border-stone-100 dark:border-stone-800/50">
            <span className="text-slate-500">Hot categories:</span>
            <span className="font-bold text-slate-900 dark:text-slate-200">{dailyPulse.categories.join(", ")}</span>
          </div>
        </div>
      </div>
      
      </div>
    </div>
  );
}
