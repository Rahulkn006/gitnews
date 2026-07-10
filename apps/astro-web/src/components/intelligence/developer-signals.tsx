"use client";

import React from "react";
import { DEVELOPER_SIGNALS_DATA } from "@/data/intelligence";

interface DeveloperSignalsProps {
  repositories?: any[];
}

export function DeveloperSignals({ repositories = [] }: DeveloperSignalsProps) {
  // Generate dynamic signals from repositories
  const signals = [];

  if (repositories.length > 0) {
    // 1. Language momentum
    const langs = repositories.reduce((acc, r) => {
      if (r.language) acc[r.language] = (acc[r.language] || 0) + (r.growth24h || 1);
      return acc;
    }, {});
    const topLang = Object.entries(langs).sort((a: any, b: any) => b[1] - a[1])[0];
    if (topLang) {
      signals.push({
        id: 1,
        icon: "🚀",
        category: `${topLang[0]} Momentum`,
        insight: `Surge in ${topLang[0]} repositories trending today, indicating strong ecosystem growth.`,
        impactScore: Math.min(95, Math.round(50 + (topLang[1] as number) / 10)),
        status: "ACCELERATING",
        statusColor: "text-emerald-500"
      });
    }

    // 2. Fastest moving repo
    const topMover = [...repositories].sort((a, b) => (b.growth24h || 0) - (a.growth24h || 0))[0];
    if (topMover && topMover.growth24h > 5) {
      signals.push({
        id: 2,
        icon: "📈",
        category: "Breakout Project",
        insight: `${topMover.name} is experiencing rapid adoption with +${topMover.growth24h} stars in 24h.`,
        impactScore: Math.min(100, Math.round(60 + topMover.growth24h / 5)),
        status: "VIRAL",
        statusColor: "text-purple-500"
      });
    }
    
    // 3. Category Shift
    const categories = repositories.reduce((acc, r) => {
      if (r.category) acc[r.category] = (acc[r.category] || 0) + 1;
      return acc;
    }, {});
    const topCat = Object.entries(categories).sort((a: any, b: any) => b[1] - a[1])[0];
    if (topCat) {
      signals.push({
        id: 3,
        icon: "🔭",
        category: "Sector Focus",
        insight: `Developer attention heavily focused on ${topCat[0]} with ${topCat[1]} projects trending.`,
        impactScore: Math.min(90, Math.round(40 + (topCat[1] as number) * 5)),
        status: "HIGH ATTENTION",
        statusColor: "text-amber-500"
      });
    }
  }

  if (signals.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-0 border-t-2 border-black dark:border-white pt-2">
      <h3 className="font-serif font-black uppercase text-lg tracking-tight text-slate-900 dark:text-white mb-4">
        Today's Signals
      </h3>
      
      <div className="flex flex-col gap-5">
        {signals.map((signal) => (
          <div key={signal.id} className="flex flex-col gap-3 pb-5 border-b border-stone-200 dark:border-stone-800 last:border-0 last:pb-0">
            
            <div className="flex items-center gap-2">
              <span className="text-base">{signal.icon}</span>
              <span className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-tight">
                {signal.category}
              </span>
            </div>
            
            <p className="text-xs text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
              {signal.insight}
            </p>
            
            <div className="flex flex-col gap-2 mt-1">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                <span>Impact</span>
                <span className="font-bold text-slate-900 dark:text-white">{signal.impactScore}</span>
              </div>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 flex-1 rounded-sm ${i < Math.round(signal.impactScore / 10) ? 'bg-slate-800 dark:bg-slate-200' : 'bg-stone-200 dark:bg-stone-800'}`} 
                  />
                ))}
              </div>
              
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest mt-1">
                <span className="text-slate-500">Status</span>
                <span className={`font-bold ${signal.statusColor}`}>{signal.status}</span>
              </div>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}
