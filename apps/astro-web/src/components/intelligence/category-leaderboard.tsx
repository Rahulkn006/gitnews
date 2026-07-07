"use client";

import React from "react";
import { CATEGORY_LEADERBOARD_DATA } from "@/data/intelligence";

export function CategoryLeaderboard() {
  return (
    <div className="flex flex-col gap-0 border-t-2 border-black dark:border-white pt-2">
      <h3 className="font-serif font-black uppercase text-lg tracking-tight text-slate-900 dark:text-white mb-4">
        Trending Categories
      </h3>
      
      <div className="flex flex-col gap-4">
        {CATEGORY_LEADERBOARD_DATA.map((category) => (
          <div key={category.rank} className="flex flex-col gap-1 pb-4 border-b border-stone-200 dark:border-stone-800 last:border-0 last:pb-0">
            
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 mt-0.5">
                  {category.rank}
                </span>
                <span className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                  {category.name}
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 whitespace-nowrap">
                ▲ {category.growth}
              </span>
            </div>
            
            <div className="pl-7 pr-1 mt-1">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-2 flex-1 ${i < Math.round(category.activityScore / 10) ? 'bg-slate-900 dark:bg-white' : 'bg-stone-100 dark:bg-stone-900'}`} 
                  />
                ))}
              </div>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}
