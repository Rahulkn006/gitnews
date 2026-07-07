import React from "react";
import {
  getLanguageColor,
  formatNumber,
  getBadge,
  badgeStyles,
  timeAgo
} from "@/lib/utils";

interface CompactRepoNewsCardProps {
  repo: any;
}

export function CompactRepoNewsCard({ repo }: CompactRepoNewsCardProps) {
  const stars = repo.stars ?? 0;
  const forks = repo.forks ?? 0;
  const badge = getBadge(stars, forks);
  const dotColor = getLanguageColor(repo.language);
  const growth = repo.weeklyGrowth || 0; 
  const contributors = Math.floor(stars * 0.005) + 12;

  // Calculate GitNews Score
  const starsWeight = Math.min((stars / 50000) * 40, 40);
  const growthSpeed = Math.min((growth / 500) * 30, 30);
  const recentActivity = 15;
  const communityInterest = Math.min((contributors / 100) * 15, 15);
  const gitNewsScore = Math.min(Math.floor(starsWeight + growthSpeed + recentActivity + communityInterest), 99);

  return (
    <a href={`/repo/${repo.owner}/${repo.name}`} className="block group">
      <article className="w-full border-b border-stone-200 dark:border-stone-800 bg-transparent transition-all duration-300 hover:bg-stone-50/50 dark:hover:bg-[#111]/30 py-5">
        
        <div className="flex flex-col justify-between min-w-0 flex-1">
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex flex-col">
                <span className="truncate text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
                  {repo.owner}
                </span>
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${dotColor}`} />
                  <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400">
                    {repo.language ?? "General"}
                  </span>
                  <span className={`shrink-0 rounded border px-1.5 py-0.5 text-[9px] font-mono font-bold ${badgeStyles[badge.tone]}`}>
                    {badge.label}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1 font-black text-sm md:text-base font-sans tracking-tight">
                  <span className={`${gitNewsScore > 85 ? 'text-orange-500' : 'text-emerald-500'}`}>
                    {gitNewsScore}
                  </span>
                  {gitNewsScore > 85 && <span>🔥</span>}
                </div>
                <span className="text-slate-400 dark:text-slate-500 text-[9px] uppercase tracking-widest font-bold">Score</span>
              </div>
            </div>
            
            <h3 className="font-serif font-black text-lg md:text-xl text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-tight mb-2">
              {repo.name}
            </h3>
            
            <p className="text-[11px] md:text-xs text-slate-600 dark:text-slate-400 line-clamp-2 font-sans leading-relaxed">
              {repo.description || "Open source repository with strong developer velocity. Generating significant interest."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[10px] md:text-[11px] font-mono text-slate-500 mt-4">
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-bold">
              ⭐ {formatNumber(stars)}
            </span>
            {growth > 0 && (
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                📈 +{formatNumber(growth)} this week
              </span>
            )}
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              🍴 {formatNumber(forks)}
            </span>
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              🧑 {formatNumber(contributors)}+
            </span>
            <span className="ml-auto text-slate-400">
              {timeAgo(repo.updatedAt || repo.lastUpdated)}
            </span>
          </div>
        </div>

      </article>
    </a>
  );
}
