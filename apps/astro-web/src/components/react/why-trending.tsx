import { Lightning } from "@phosphor-icons/react";
import React from "react";
import { ContributionHeatmap, MiniStarGraph } from "./analytics-visuals";

export function WhyTrending({ repoName }: { repoName: string }) {
  return (
    <div className="bg-stone-50 dark:bg-stone-900/50 rounded-lg p-5 border border-stone-200 dark:border-stone-800">
      <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
        <Lightning className="w-4 h-4 text-emerald-500" weight="fill" /> Why
        it's trending
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Star Velocity
            </span>
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
              +1,204 this week
            </span>
          </div>
          <MiniStarGraph seed={repoName} color="#10b981" />
        </div>

        <div>
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Release Activity
            </span>
            <span className="text-xs font-mono text-slate-500">
              v2.1 just dropped
            </span>
          </div>
          <div className="pt-2">
            <ContributionHeatmap seed={repoName} />
          </div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1da1f2]/10 text-[#1da1f2] text-xs">
            X
          </span>
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
            Viral discussion on X
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#ff6600]/10 text-[#ff6600] font-bold text-[10px]">
            Y
          </span>
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
            Front page HN
          </span>
        </div>
      </div>
    </div>
  );
}
