"use client";

import { LEARNING_SIGNALS_DATA } from "@/data/learning-intelligence";
import React from "react";

interface LearningSignalsProps {
  repositories?: any[];
}

export function LearningSignals({ repositories = [] }: LearningSignalsProps) {
  if (!repositories.length) return null;

  // Extract top languages or topics as learning signals
  const topics = repositories.reduce((acc, r) => {
    r.topics?.forEach((t: string) => {
      if (!["github", "api", "library"].includes(t.toLowerCase())) {
        acc[t] = (acc[t] || 0) + (r.growth24h || 1);
      }
    });
    return acc;
  }, {});

  const signals = Object.entries(topics)
    .sort((a: any, b: any) => b[1] - a[1])
    .slice(0, 3)
    .map(([topic, score]: any, index) => ({
      id: index,
      rank: `0${index + 1}`,
      topic: topic.charAt(0).toUpperCase() + topic.slice(1),
      reasonLabel:
        index === 0
          ? "Highest Demand"
          : index === 1
            ? "Rapid Growth"
            : "Emerging Tech",
      reason: `Gaining significant traction across trending projects with a combined growth impact of ${Math.round(score)}.`,
    }));

  return (
    <div className="flex flex-col gap-0 border-t-2 border-black dark:border-white pt-2">
      <h3 className="font-serif font-black uppercase text-sm tracking-tight text-slate-900 dark:text-white mb-3">
        This Week's Learning
      </h3>

      <div className="flex flex-col gap-4">
        {signals.map((signal) => (
          <div
            key={signal.id}
            className="flex flex-col gap-1 pb-3 border-b border-stone-200 dark:border-stone-800 last:border-0 last:pb-0"
          >
            <span className="text-xl font-serif font-black text-slate-300 dark:text-slate-700 leading-none mb-1">
              {signal.rank}
            </span>
            <span className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
              {signal.topic}
            </span>
            <div className="flex flex-col mt-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-0.5">
                {signal.reasonLabel}
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-sans leading-relaxed">
                {signal.reason}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
