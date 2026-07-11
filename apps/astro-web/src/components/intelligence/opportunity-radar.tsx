"use client";

import { OPPORTUNITY_RADAR_DATA } from "@/data/learning-intelligence";
import React from "react";

interface OpportunityRadarProps {
  repositories?: any[];
}

export function OpportunityRadar({ repositories = [] }: OpportunityRadarProps) {
  if (!repositories.length) return null;

  // Find fast growing repos and translate them into opportunities
  const opportunities = repositories
    .sort((a, b) => (b.growth24h || 0) - (a.growth24h || 0))
    .slice(0, 3)
    .map((r, idx) => ({
      id: r.id,
      category: r.category || "General",
      topic: r.name,
      signal: idx === 0 ? "▲ EARLY ADOPTER" : "▲ RAPID GROWTH",
      signalColor:
        idx === 0
          ? "text-purple-600 dark:text-purple-400"
          : "text-emerald-600 dark:text-emerald-400",
    }));

  return (
    <div className="flex flex-col gap-0 border-t-2 border-black dark:border-white pt-2">
      <h3 className="font-serif font-black uppercase text-sm tracking-tight text-slate-900 dark:text-white mb-3">
        Opportunity Radar
      </h3>

      <div className="flex flex-col gap-3">
        {opportunities.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-1 p-3 bg-stone-50 dark:bg-[#111] border border-stone-200 dark:border-stone-800 rounded"
          >
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
              {item.category}
            </span>
            <span className="font-bold text-sm text-slate-900 dark:text-white mt-1">
              {item.topic}
            </span>
            <span
              className={`text-[10px] font-mono font-bold uppercase tracking-widest mt-1 ${item.signalColor}`}
            >
              {item.signal}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
