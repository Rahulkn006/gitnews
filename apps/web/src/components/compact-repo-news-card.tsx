import React from "react";
import Link from "next/link";
import { MiniStarGraph } from "./analytics-visuals";

interface CompactRepoNewsCardProps {
  repo: any;
}

const langColors: Record<string, string> = {
  TypeScript: "bg-blue-500",
  JavaScript: "bg-yellow-500",
  Python: "bg-emerald-500",
  Go: "bg-cyan-500",
  Rust: "bg-orange-600",
  HTML: "bg-red-500",
  CSS: "bg-purple-500",
};

function formatNumber(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
  return String(value);
}

function getBadge(stars: number, forks: number) {
  if (stars >= 100_000) return { label: "Trending", tone: "hot" };
  if (forks >= 10_000) return { label: "Launch", tone: "launch" };
  if (stars < 5_000) return { label: "New", tone: "new" };
  return { label: "Rising", tone: "rising" };
}

const badgeStyles: Record<string, string> = {
  hot: "text-orange-600 bg-orange-500/10 border-orange-500/20",
  launch: "text-purple-600 bg-purple-500/10 border-purple-500/20",
  new: "text-yellow-600 bg-yellow-500/10 border-yellow-500/20",
  rising: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
};

function hashString(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function generateGradient(name: string) {
  const h = hashString(name);
  return `linear-gradient(135deg, hsl(${h % 360} 70% 55%), hsl(${(h * 2) % 360} 70% 45%))`;
}

export function CompactRepoNewsCard({ repo }: CompactRepoNewsCardProps) {
  const stars = repo.stars ?? 0;
  const forks = repo.forks ?? 0;
  const badge = getBadge(stars, forks);
  const dotColor = langColors[repo.language] ?? "bg-slate-400";
  const growth = repo.weeklyGrowth || Math.floor(Math.random() * 200 + 50);
  const timeAgo = Math.floor(Math.random() * 59 + 1);
  
  // Use opengraph image, fallback to avatar, fallback to gradient
  const imageUrl = repo.url ? `https://opengraph.githubassets.com/1/${repo.owner}/${repo.name}` : (repo.avatar || repo.ownerAvatar);

  return (
    <Link href={`/repo/${repo.owner}/${repo.name}`} className="block group">
      <article className="flex h-32 w-full overflow-hidden border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#111] transition-all duration-300 hover:shadow-md hover:border-stone-300 dark:hover:border-stone-700">
        
        {/* Left: Thumbnail */}
        <div className="w-40 md:w-48 shrink-0 bg-stone-100 dark:bg-stone-900 relative overflow-hidden">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={repo.name}
              className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                if (e.currentTarget.nextElementSibling) {
                  (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'block';
                }
              }}
            />
          ) : null}
          <div 
            className="absolute inset-0 w-full h-full" 
            style={{ background: generateGradient(repo.name), display: imageUrl ? 'none' : 'block' }} 
          />
        </div>

        {/* Right: Content */}
        <div className="flex flex-col justify-between p-3 md:p-4 min-w-0 flex-1">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="truncate text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {repo.owner} / {repo.name}
              </span>
              <span className={`shrink-0 rounded border px-1.5 py-0.5 text-[9px] font-mono font-bold ${badgeStyles[badge.tone]}`}>
                {badge.label}
              </span>
            </div>
            
            <h3 className="truncate font-serif font-bold text-base md:text-lg text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {repo.aiSummary ? repo.aiSummary.split('.')[0] : `Why developers are watching ${repo.name}`}
            </h3>
            
            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-1 font-sans leading-relaxed">
              {repo.description || "Open source repository with strong developer velocity. Generating significant interest."}
            </p>
          </div>

          <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500 mt-2">
            <span className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${dotColor}`} />
              {repo.language ?? "General"}
            </span>
            <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
              ⭐ {formatNumber(stars)}
            </span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/50 px-1 rounded-sm">
              🔥 +{growth} today
            </span>
            <span className="hidden sm:inline-block ml-auto text-slate-400">
              {timeAgo} mins ago
            </span>
          </div>
        </div>

      </article>
    </Link>
  );
}
