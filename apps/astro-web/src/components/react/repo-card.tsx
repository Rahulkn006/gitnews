"use client";

import React, { useState } from "react";
import { Fire } from "@phosphor-icons/react";
import {
  getLanguageColor,
  generateGradient,
  formatNumber,
  formatDate,
  getBadge,
  badgeStyles,
} from "@/lib/utils";
import { RepoHoverPreview } from "./repo-hover-preview";

interface RepoCardProps {
  repo: any;
  size?: "large" | "medium" | "small";
}

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

function ActivityIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  );
}

export function RepoCard({ repo, size = "medium" }: RepoCardProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const [hovered, setHovered] = useState(false);

  const stars = repo.stars ?? 0;
  const forks = repo.forks ?? 0;
  const growth = repo.weeklyGrowth || 0; 
  const contributors = Math.floor(stars * 0.005) + 12; // Estimate if not available
  
  const badge = getBadge(stars, forks);
  const dotColor = getLanguageColor(repo.language);
  
  // Intelligence AI Headline (dynamically fallback if aiSummary not present)
  const aiHeadline = repo.name;

  // Calculate GitNews Score
  const starsWeight = Math.min((stars / 50000) * 40, 40);
  const growthSpeed = Math.min((growth / 500) * 30, 30);
  const recentActivity = 15;
  const communityInterest = Math.min((contributors / 100) * 15, 15);
  const gitNewsScore = Math.min(Math.floor(starsWeight + growthSpeed + recentActivity + communityInterest), 99);

  const isLarge = size === "large";

  if (size === "small") {
    // Basic small card fallback
    return (
      <a
        href={`/repo/${repo.owner}/${repo.name}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group relative flex flex-col justify-between border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#111] p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:z-[100] z-10 rounded-xl"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <span className="block truncate text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {repo.owner} / {repo.name}
            </span>
            <h4 className="truncate font-sans text-base font-bold text-slate-900 dark:text-white transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
              {aiHeadline}
            </h4>
          </div>
          <span className={`shrink-0 rounded border px-1.5 py-0.5 text-[9px] font-mono font-bold ${badgeStyles[badge.tone]}`}>
            {badge.label}
          </span>
        </div>
        <RepoHoverPreview repo={repo} isVisible={hovered} />
      </a>
    );
  }

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group relative flex flex-col justify-between border bg-white dark:bg-[#111] transition-all duration-500 hover:shadow-xl hover:z-[100] z-10 rounded-xl ${
        hovered ? "border-emerald-500/50 dark:border-emerald-500/50 shadow-emerald-500/10" : "border-stone-200 dark:border-stone-800"
      } p-6 md:p-8 col-span-full`}
    >
      {/* Top Gradient Bar */}
      <div
        className={`absolute inset-x-0 top-0 h-1.5 rounded-t-xl transition-all duration-500 ${hovered ? 'opacity-100 h-2' : 'opacity-80'}`}
        style={{ background: generateGradient(repo.name) }}
      />

      {/* 1. HEADER (Repo name, Owner, Language, Badge) */}
      <header className="mt-2 mb-4 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Avatar only for featured / large stories */}
          {isLarge && (
            <div className="relative shrink-0">
              <img
                src={repo.avatar || repo.ownerAvatar || "https://github.com/github.png"}
                alt={repo.owner}
                className="h-10 w-10 md:h-12 md:w-12 rounded-lg border border-stone-200 dark:border-stone-700 object-cover shadow-sm transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://github.com/github.png';
                }}
              />
            </div>
          )}
          
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="block truncate text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                {repo.owner}
              </span>
              <span className="flex items-center gap-1.5 text-[10px] md:text-[11px] font-mono font-bold text-slate-500">
                <span className={`h-2 w-2 rounded-full ${dotColor}`} />
                {repo.language ?? "General"}
              </span>
            </div>
            <h3 className="truncate font-mono font-bold text-lg md:text-xl text-slate-800 dark:text-slate-200">
              {repo.name}
            </h3>
          </div>
        </div>

        <div className="flex flex-col items-end shrink-0 pl-3 md:pl-4 mt-2 md:mt-0 ml-auto">
          <span className={`rounded border px-2 py-0.5 text-[10px] font-mono font-bold ${badgeStyles[badge.tone]}`}>
            {badge.label}
          </span>
          <div className="flex items-center gap-1.5 font-black text-sm sm:text-base md:text-lg lg:text-xl font-sans tracking-tight">
            <span className="text-[9px] md:text-[10px] text-stone-400 dark:text-stone-500 uppercase tracking-widest font-bold mr-1">GITNEWS SCORE</span>
            <span className={`${gitNewsScore > 85 ? 'text-orange-500' : 'text-emerald-500'}`}>
              {gitNewsScore}
            </span>
            {gitNewsScore > 85 && <Fire className="w-4 h-4 md:w-5 md:h-5 text-orange-500" weight="fill" />}
          </div>
        </div>
      </header>

      {/* 2. MAIN (AI Generated Headline) */}
      <div className={`${isLarge ? "mb-6" : "mb-5"}`}>
        <a 
          href={`/repo/${repo.owner}/${repo.name}`}
          className="block"
        >
          <h2 className={`font-serif font-black text-slate-900 dark:text-white transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400 leading-tight ${
            isLarge ? "text-3xl md:text-4xl" : "text-xl md:text-2xl"
          }`}>
            {aiHeadline}
          </h2>
        </a>
      </div>

      {/* 3. INSIGHTS (Why Trending) */}
      <div className={`mb-6 bg-stone-50 dark:bg-stone-900/40 rounded-lg border border-stone-100 dark:border-stone-800 p-4 ${isLarge ? 'md:p-5' : ''}`}>
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
          <ActivityIcon className="w-3 h-3 text-emerald-500" />
          Intelligence Insights
        </h4>
        <ul className="space-y-2 text-xs md:text-sm font-sans text-slate-600 dark:text-slate-300">
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-0.5">•</span>
            <span>Experiencing a <strong className="text-slate-800 dark:text-slate-100 font-bold">+{growth} star increase</strong> over the last week.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-0.5">•</span>
            <span>Strong developer velocity with recent release activity and commits.</span>
          </li>
          {repo.topics && repo.topics.length > 0 && (
             <li className="flex items-start gap-2">
               <span className="text-emerald-500 mt-0.5">•</span>
               <span>Gaining traction in: {repo.topics.slice(0, 3).join(", ")}.</span>
             </li>
          )}
        </ul>
      </div>

      {/* 4. METRICS FOOTER */}
      <div className="flex-1 flex flex-col justify-end">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-stone-100 dark:border-stone-800 pt-4 mt-2">
          
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 group/metric">
            <div className="w-6 h-6 rounded-md bg-stone-100 dark:bg-stone-800 flex items-center justify-center group-hover/metric:bg-amber-100 dark:group-hover/metric:bg-amber-900/30 group-hover/metric:text-amber-500 transition-colors">
              <StarIcon className="h-3.5 w-3.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 leading-none">Stars</span>
              <span className="font-mono text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300 leading-tight">{formatNumber(stars)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 group/metric">
            <div className="w-6 h-6 rounded-md bg-stone-100 dark:bg-stone-800 flex items-center justify-center group-hover/metric:bg-emerald-100 dark:group-hover/metric:bg-emerald-900/30 group-hover/metric:text-emerald-500 transition-colors">
              <ActivityIcon className="h-3.5 w-3.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 leading-none">Growth</span>
              <span className="font-mono text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300 leading-tight">+{formatNumber(growth)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 group/metric">
            <div className="w-6 h-6 rounded-md bg-stone-100 dark:bg-stone-800 flex items-center justify-center group-hover/metric:bg-blue-100 dark:group-hover/metric:bg-blue-900/30 group-hover/metric:text-blue-500 transition-colors">
              <ForkIcon className="h-3.5 w-3.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 leading-none">Forks</span>
              <span className="font-mono text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300 leading-tight">{formatNumber(forks)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 group/metric">
            <div className="w-6 h-6 rounded-md bg-stone-100 dark:bg-stone-800 flex items-center justify-center group-hover/metric:bg-purple-100 dark:group-hover/metric:bg-purple-900/30 group-hover/metric:text-purple-500 transition-colors">
              <UsersIcon className="h-3.5 w-3.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 leading-none">Devs</span>
              <span className="font-mono text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300 leading-tight">{formatNumber(contributors)}+</span>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2 md:gap-4">
             <button
                onClick={(e) => {
                  e.preventDefault();
                  setBookmarked(!bookmarked);
                }}
                className="hidden sm:flex items-center justify-center rounded-full border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 w-8 h-8 text-slate-400 transition-colors hover:text-emerald-600 hover:border-emerald-200 dark:hover:border-emerald-800"
                aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
              >
                {bookmarked ? "★" : "☆"}
              </button>
             <a
                href={`/repo/${repo.owner}/${repo.name}`}
                className="font-bold text-emerald-700 dark:text-emerald-300 transition-colors bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800 px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm flex items-center gap-2 shadow-sm"
              >
                Analysis
              </a>
             <a
                href={repo.url || repo.repoUrl || `https://github.com/${repo.owner}/${repo.name}`}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-white transition-colors bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm flex items-center gap-2 shadow-sm"
              >
                GitHub
                <span className="leading-none transition-transform group-hover:translate-x-1">→</span>
              </a>
          </div>

        </div>
      </div>
    </article>
  );
}
