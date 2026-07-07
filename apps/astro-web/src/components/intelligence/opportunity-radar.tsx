"use client";

import React from "react";
import { OPPORTUNITY_RADAR_DATA } from "@/data/learning-intelligence";

export function OpportunityRadar() {
  return (
    <div className="flex flex-col gap-0 border-t-2 border-black dark:border-white pt-2">
      <h3 className="font-serif font-black uppercase text-sm tracking-tight text-slate-900 dark:text-white mb-3">
        Opportunity Radar
      </h3>
      
      <div className="flex flex-col gap-3">
        {OPPORTUNITY_RADAR_DATA.map((item) => (
          <div key={item.id} className="flex flex-col gap-1 p-3 bg-stone-50 dark:bg-[#111] border border-stone-200 dark:border-stone-800 rounded">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
              {item.category}
            </span>
            <span className="font-bold text-sm text-slate-900 dark:text-white mt-1">
              {item.topic}
            </span>
            <span className={`text-[10px] font-mono font-bold uppercase tracking-widest mt-1 ${item.signalColor}`}>
              {item.signal}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
