"use client";

import { CATEGORY_LEADERBOARD_DATA } from "@/data/intelligence";
import React from "react";

interface CategoryLeaderboardProps {
  repositories?: any[];
}

export function CategoryLeaderboard({
  repositories = [],
}: CategoryLeaderboardProps) {
  if (!repositories.length) return null;

  // Group by category and calculate growth/activity
  const groups = repositories.reduce((acc, r) => {
    if (r.category) {
      if (!acc[r.category])
        acc[r.category] = { growth: 0, count: 0, activity: 0 };
      acc[r.category].growth += r.growth24h || 0;
      acc[r.category].count += 1;
      acc[r.category].activity += r.velocityScore || 0;
    }
    return acc;
  }, {});

  const leaderBoard = Object.entries(groups)
    .map(([name, data]: any) => ({
      name,
      growth: `+${Math.round(data.growth)}%`, // using absolute stars as percentage approximation for UI
      activityScore: Math.min(
        100,
        Math.round((data.activity / data.count) * 10 + 50),
      ),
    }))
    .sort((a, b) => b.activityScore - a.activityScore)
    .slice(0, 5)
    .map((item, index) => ({ ...item, rank: index + 1 }));

  return (
    <div className="flex flex-col gap-0 border-t-2 border-black dark:border-white pt-2">
      <h3 className="font-serif font-black uppercase text-lg tracking-tight text-slate-900 dark:text-white mb-4">
        Trending Categories
      </h3>

      <div className="flex flex-col gap-4">
        {leaderBoard.map((category) => (
          <div
            key={category.rank}
            className="flex flex-col gap-1 pb-4 border-b border-stone-200 dark:border-stone-800 last:border-0 last:pb-0"
          >
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
                    className={`h-2 flex-1 ${i < Math.round(category.activityScore / 10) ? "bg-slate-900 dark:bg-white" : "bg-stone-100 dark:bg-stone-900"}`}
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
