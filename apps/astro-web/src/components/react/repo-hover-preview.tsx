"use client";

import React from "react";
import { Fire, RocketLaunch, Star } from "@phosphor-icons/react";
import { getLanguageColor, formatNumber } from "@/lib/utils";

interface RepoHoverPreviewProps {
  repo: any;
  isVisible: boolean;
}

export function RepoHoverPreview({ repo, isVisible }: RepoHoverPreviewProps) {
  if (!isVisible) return null;

  const dotColor = getLanguageColor(repo.language);
  const stars = repo.stars ?? 0;
  const growth = repo.weeklyGrowth ?? 0;

  // Mocking intelligence verdict based on available data since backend modification is forbidden
  const isHighGrowth = growth > 500;
  const verdictNode = isHighGrowth ? (
    <span className="flex items-center gap-1">Learn Now <RocketLaunch className="w-4 h-4 text-rose-400" weight="fill" /></span>
  ) : (
    <span className="flex items-center gap-1">Worth Watching <Star className="w-4 h-4 text-amber-400" weight="fill" /></span>
  );

  return (
    <div className="absolute z-50 left-0 bottom-full mb-2 w-72 md:w-80 bg-stone-900 dark:bg-stone-50 border border-stone-800 dark:border-stone-200 rounded-xl shadow-2xl p-4 md:p-5 text-stone-100 dark:text-stone-900 animate-in fade-in slide-in-from-bottom-2 duration-200">
      
      {/* Pointer/Triangle */}
      <div className="absolute -bottom-2 left-6 w-4 h-4 bg-stone-900 dark:bg-stone-50 border-b border-r border-stone-800 dark:border-stone-200 rotate-45" />

      <div className="relative z-10 flex flex-col gap-3">
        <h4 className="font-serif font-black text-lg leading-tight flex items-center gap-2">
          <Fire className="w-5 h-5 text-orange-500" weight="fill" /> {repo.name}
        </h4>
        
        <p className="text-xs text-stone-300 dark:text-stone-700 font-sans leading-relaxed">
          {repo.description}
        </p>
        
        <div className="flex flex-col gap-1.5 mt-1 border-t border-stone-800 dark:border-stone-200 pt-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 dark:text-stone-500 font-bold">
            Activity Signal
          </span>
          <span className="text-xs font-bold text-emerald-400 dark:text-emerald-600">
            +{formatNumber(growth)} stars this week
          </span>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-mono font-bold text-stone-300 dark:text-stone-600">
            <span className={`h-2 w-2 rounded-full ${dotColor}`} />
            {repo.language ?? "General"}
          </div>
          
          <div className="flex items-center gap-1 text-[10px] md:text-xs font-mono font-bold text-stone-300 dark:text-stone-600">
            <Star className="w-3 h-3" weight="fill" />
            {formatNumber(stars)}
          </div>
        </div>

        <div className="flex items-center justify-between mt-2 pt-3 border-t border-stone-800 dark:border-stone-200">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400 flex items-center gap-1">
              GitNews Verdict
            </span>
            <span className="text-xs font-bold font-sans">
              {verdictNode}
            </span>
        </div>
      </div>
    </div>
  );
}
