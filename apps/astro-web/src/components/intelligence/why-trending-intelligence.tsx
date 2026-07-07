"use client";

import React from "react";
import { WHY_TRENDING_DATA } from "@/data/repository-intelligence";

export function WhyTrendingIntelligence() {
  return (
    <div className="flex flex-col gap-0 border-t-2 border-black dark:border-white pt-2">
      <h3 className="font-serif font-black uppercase text-sm tracking-tight text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <span>🔥</span> Why Trending
      </h3>
      
      <div className="flex flex-col gap-5">
        {WHY_TRENDING_DATA.map((item) => (
          <div key={item.id} className="flex flex-col gap-3 pb-5 border-b border-stone-200 dark:border-stone-800 last:border-0 last:pb-0">
            
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900 dark:text-white leading-tight underline decoration-stone-300 dark:decoration-stone-700 underline-offset-4 decoration-1 hover:decoration-emerald-500 transition-colors">
                {item.name}
              </span>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded">
                {item.score}
              </span>
            </div>
            
            <div className="flex flex-col gap-2 mt-1">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {item.headline}
              </span>
              
              <ul className="flex flex-col gap-1.5 pl-0">
                {item.reasons.map((reason, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
                    <span className="text-emerald-500 font-bold shrink-0">✓</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex flex-col gap-1 mt-1 bg-stone-50 dark:bg-[#111] p-3 rounded border border-stone-100 dark:border-stone-800">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                GitNews Verdict:
              </span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {item.verdict}
              </span>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}
