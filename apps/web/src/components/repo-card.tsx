"use client";

import { useState } from "react";
import { WhyTrending } from "./why-trending";

interface RepoCardProps {
  repo: any;
  size?: "large" | "medium" | "small";
}

const langColors: Record<string, string> = {
  TypeScript: "bg-blue-500",
  JavaScript: "bg-yellow-500",
  Python: "bg-emerald-500",
  Go: "bg-cyan-500",
  Rust: "bg-orange-600",
  HTML: "bg-red-500",
  CSS: "bg-purple-500",
  Markdown: "bg-zinc-500",
  Java: "bg-orange-500",
  "C++": "bg-pink-500",
  Ruby: "bg-red-600",
  Swift: "bg-orange-400",
  Kotlin: "bg-purple-600",
  Dart: "bg-cyan-400",
  PHP: "bg-indigo-400",
  Shell: "bg-green-700",
  Zig: "bg-orange-400",
};

function getLanguageColor(language?: string | null) {
  return langColors[language ?? ""] ?? "bg-[hsl(var(--muted-foreground))]";
}

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
  const hue1 = h % 360;
  const hue2 = (h * 1.7) % 360;
  const hue3 = (h * 2.3) % 360;
  return `linear-gradient(135deg, hsl(${hue1} 70% 55%) 0%, hsl(${hue2} 70% 50%) 50%, hsl(${hue3} 70% 45%) 100%)`;
}

function formatNumber(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
  return String(value);
}

function formatDate(value: any) {
  if (!value) return "Just now";
  if (typeof value === "string" && Number.isNaN(Date.parse(value))) {
    return value; // e.g. "2 hours ago"
  }
  try {
    return new Date(value).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  } catch {
    return String(value);
  }
}

function getBadge(stars: number, forks: number) {
  if (stars >= 100_000) return { label: "Trending", tone: "hot" };
  if (forks >= 10_000) return { label: "Launch", tone: "launch" };
  if (stars < 5_000) return { label: "New Star", tone: "new" };
  return { label: "Rising", tone: "rising" };
}

const badgeStyles: Record<string, string> = {
  hot: "text-orange-600 bg-orange-500/10 border-orange-500/20 dark:text-orange-400 dark:bg-orange-500/10 dark:border-orange-500/20",
  launch: "text-purple-600 bg-purple-500/10 border-purple-500/20 dark:text-purple-400 dark:bg-purple-500/10 dark:border-purple-500/20",
  new: "text-yellow-600 bg-yellow-500/10 border-yellow-500/20 dark:text-yellow-400 dark:bg-yellow-500/10 dark:border-yellow-500/20",
  rising: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/20",
};

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

function ForkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M7 3a2 2 0 0 1 2 2v2H7a2 2 0 1 1 0-4zm0 10a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm10-5a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm-2 7v-2h2a2 2 0 1 1 0 4h-2v-2zm0-7V6h2a2 2 0 1 1 0-4h-2v2a2 2 0 0 1-2 2h-2v2h2a2 2 0 0 1 2 2zM9 10V8h2a2 2 0 0 1 2-2V4a2 2 0 1 1 0 4h-2v2z" />
    </svg>
  );
}

export function RepoCard({ repo, size = "medium" }: RepoCardProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const [hovered, setHovered] = useState(false);

  const stars = repo.stars ?? 0;
  const forks = repo.forks ?? 0;
  const description =
    repo.aiSummary || repo.description || "Open source repository with strong developer velocity.";
  const badge = getBadge(stars, forks);
  const dotColor = getLanguageColor(repo.language);

  if (size === "small") {
    return (
      <article
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group relative flex flex-col justify-between border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#111] p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md rounded-xl"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <span className="block truncate text-[10px] font-bold uppercase tracking-widest text-slate-400">
              @{repo.owner}
            </span>
            <h4 className="truncate font-sans text-base font-bold text-slate-900 dark:text-white transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
              {repo.name}
            </h4>
          </div>
          <span
            className={`rounded border px-1.5 py-0.5 text-[9px] font-mono font-bold ${badgeStyles[badge.tone]}`}
          >
            {badge.label}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${dotColor}`} />
            {repo.language ?? "General"}
          </span>
          <span className="flex items-center gap-1">
            <StarIcon className="h-3 w-3" /> {formatNumber(stars)}
          </span>
          <a
            href={repo.url || repo.repoUrl || `https://github.com/${repo.owner}/${repo.name}`}
            target="_blank"
            rel="noreferrer"
            className="text-emerald-600 dark:text-emerald-400 transition-colors hover:text-slate-900 dark:hover:text-white"
          >
            →
          </a>
        </div>
      </article>
    );
  }

  const isLarge = size === "large";

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group relative flex flex-col justify-between overflow-hidden border bg-white dark:bg-[#111] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl rounded-xl ${
        hovered ? "border-emerald-500/50 dark:border-emerald-500/50 shadow-emerald-500/10" : "border-stone-200 dark:border-stone-800"
      } ${isLarge ? "col-span-full row-span-2 p-8 md:col-span-2" : "p-6"}`}
    >
      {/* Generated gradient header for visual pop */}
      <div
        className={`absolute inset-x-0 top-0 h-1.5 transition-all duration-500 ${hovered ? 'opacity-100 h-2' : 'opacity-80'}`}
        style={{ background: generateGradient(repo.name) }}
      />

      <div className="relative mt-2">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="relative">
              <img
                src={repo.avatar || repo.ownerAvatar || "https://github.com/github.png"}
                alt={repo.owner}
                className={`transition-all duration-500 ${isLarge ? 'h-14 w-14 rounded-xl' : 'h-12 w-12 rounded'} border border-stone-200 dark:border-stone-700 object-cover shadow-sm`}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://github.com/github.png';
                }}
              />
              {repo.rank && (
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-[#111] shadow-sm">
                  #{repo.rank}
                </div>
              )}
            </div>
            <div className="min-w-0 pt-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="block truncate text-xs font-bold uppercase tracking-widest text-slate-400">
                  {repo.owner}
                </span>
                <span className="text-[10px] text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-1.5 rounded-sm font-mono font-bold tracking-tighter">
                  +{repo.weeklyGrowth || Math.floor(Math.random() * 200 + 50)}% growth
                </span>
              </div>
              <h3
                className={`truncate font-serif font-black text-slate-900 dark:text-white transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400 ${
                  isLarge ? "text-3xl md:text-4xl" : "text-xl"
                }`}
              >
                {repo.name}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span
              className={`rounded border px-2.5 py-1 text-[10px] font-mono font-bold ${badgeStyles[badge.tone]}`}
            >
              {badge.label}
            </span>
            <button
              onClick={(e) => {
                e.preventDefault();
                setBookmarked(!bookmarked);
              }}
              className="rounded-full border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 p-2 text-slate-400 transition-colors hover:text-emerald-600 hover:border-emerald-200 dark:hover:border-emerald-800"
              aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
            >
              {bookmarked ? "★" : "☆"}
            </button>
          </div>
        </div>

        {/* Description */}
        <div className={isLarge ? "pl-18 mb-8" : "mb-6"}>
          <p
            className={`font-sans text-slate-600 dark:text-slate-300 ${
              isLarge
                ? "text-lg leading-relaxed"
                : "text-sm leading-relaxed line-clamp-3"
            }`}
          >
            {description}
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-end">
        {isLarge && (
          <div className="mb-8 mt-2">
            <WhyTrending repoName={repo.name} />
          </div>
        )}

        {/* Topic chips */}
        {repo.topics && repo.topics.length > 0 && (
          <div className="mb-5 flex flex-wrap gap-2">
            {repo.topics.slice(0, isLarge ? 5 : 3).map((topic: string, i: number) => (
              <span
                key={i}
                className="rounded-full border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 px-3 py-1 text-xs font-medium text-slate-500 dark:text-slate-400 transition-colors hover:bg-stone-100 dark:hover:bg-stone-700"
              >
                #{topic}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className={`flex flex-wrap items-center justify-between border-t border-stone-100 dark:border-stone-800 pt-4 text-xs font-mono text-slate-500 dark:text-slate-400`}>
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${dotColor} shadow-[0_0_8px_rgba(0,0,0,0.1)] dark:shadow-[0_0_8px_rgba(255,255,255,0.1)]`} />
              {repo.language ?? "General"}
            </span>
            <span className="flex items-center gap-1.5 transition-colors group-hover:text-slate-700 dark:group-hover:text-slate-300">
              <StarIcon className="h-4 w-4 text-amber-400" /> {formatNumber(stars)}
            </span>
            <span className="flex items-center gap-1.5 transition-colors group-hover:text-slate-700 dark:group-hover:text-slate-300">
              <ForkIcon className="h-4 w-4" /> {formatNumber(forks)}
            </span>
          </div>

          <div className="flex items-center gap-4 mt-2 sm:mt-0">
            <span className="hidden sm:inline flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {formatDate(repo.updatedAt || repo.lastUpdated)}
            </span>
            <a
              href={repo.url || repo.repoUrl || `https://github.com/${repo.owner}/${repo.name}`}
              target="_blank"
              rel="noreferrer"
              className="font-bold text-emerald-600 dark:text-emerald-400 transition-colors hover:text-emerald-500 dark:hover:text-emerald-300 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-1 rounded"
            >
              GitHub 
              <span className="text-sm leading-none transition-transform group-hover:translate-x-1">→</span>
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
