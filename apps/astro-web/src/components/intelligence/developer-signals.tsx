"use client";

import React from "react";
import { DEVELOPER_SIGNALS_DATA } from "@/data/intelligence";

export function DeveloperSignals() {
  return (
    <div className="flex flex-col gap-0 border-t-2 border-black dark:border-white pt-2">
      <h3 className="font-serif font-black uppercase text-lg tracking-tight text-slate-900 dark:text-white mb-4">
        Today's Signals
      </h3>
      
      <div className="flex flex-col gap-5">
        {DEVELOPER_SIGNALS_DATA.map((signal) => (
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
