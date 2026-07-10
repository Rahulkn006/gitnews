"use client";

import React from "react";
import { SHOULD_LEARN_DATA } from "@/data/learning-intelligence";

interface ShouldLearnThisProps {
  repositories?: any[];
}

export function ShouldLearnThis({ repositories = [] }: ShouldLearnThisProps) {
  if (!repositories.length) return null;

  // Filter repos that have an explicit learningValue in verdict
  const learningRepos = repositories
    .filter(r => r.verdict && r.verdict.learningValue)
    .sort((a, b) => (b.growth24h || 0) - (a.growth24h || 0))
    .slice(0, 3)
    .map((r, idx) => {
      const isHigh = ["Excellent", "High", "Very High"].includes(r.verdict.learningValue);
      return {
        id: r.id,
        icon: idx === 0 ? "🌟" : (idx === 1 ? "🧠" : "⚙️"),
        name: r.name,
        verdict: r.verdict.learningValue,
        verdictColor: isHigh ? "text-emerald-600 border-emerald-600 bg-emerald-50" : "text-amber-600 border-amber-600 bg-amber-50",
        reason: r.aiSummary || r.verdict.summary || "High developer interest and adoption.",
        difficulty: "Varies", // Could be AI generated but hardcoded for now
        futureScore: isHigh ? 5 : 4
      };
    });

  if (learningRepos.length === 0) return null;

  return (
    <div className="flex flex-col gap-0 border-t-2 border-black dark:border-white pt-2">
      <h3 className="font-serif font-black uppercase text-sm tracking-tight text-slate-900 dark:text-white mb-3">
        Should You Learn?
      </h3>
      
      <div className="flex flex-col gap-4">
        {learningRepos.map((item) => (
          <div key={item.id} className="flex flex-col gap-3 pb-4 border-b border-stone-200 dark:border-stone-800 last:border-0 last:pb-0">
            
            <div className="flex items-center gap-2">
              <span className="text-base">{item.icon}</span>
              <span className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                {item.name}
              </span>
            </div>
            
            <div className="flex flex-col gap-1.5 mt-1">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest">
                <span className="text-slate-500">Verdict:</span>
                <span className={`font-bold px-1.5 py-0.5 rounded border ${item.verdictColor}`}>
                  {item.verdict}
                </span>
              </div>
              
              <div className="flex flex-col mt-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-0.5">Reason:</span>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-sans leading-relaxed">
                  {item.reason}
                </p>
              </div>
              
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest mt-1">
                <span className="text-slate-500">Difficulty:</span>
                <span className="text-slate-700 dark:text-slate-300">{item.difficulty}</span>
              </div>
              
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest">
                <span className="text-slate-500">Future:</span>
                <span className="text-emerald-500 text-xs">
                  {"★".repeat(item.futureScore)}{"☆".repeat(5 - item.futureScore)}
                </span>
              </div>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}
