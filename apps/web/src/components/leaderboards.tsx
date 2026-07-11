"use client";

import { mockRepositories } from "@/data/repositories";
import Link from "next/link";

export function Leaderboards() {
  const topRepos = [...mockRepositories]
    .sort((a, b) => b.stars - a.stars)
    .slice(0, 5);
  const topDevelopers = [
    "torvalds",
    "yyx990803",
    "gaearon",
    "antfu",
    "sindresorhus",
  ];
  const topOrgs = ["vercel", "facebook", "microsoft", "google", "kubernetes"];
  const fastestGrowing = [...mockRepositories]
    .sort((a, b) => b.weeklyGrowth - a.weeklyGrowth)
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-10">
      {/* Top Repositories */}
      <div className="bg-white dark:bg-[#111] border border-stone-200 dark:border-stone-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-5 border-b border-stone-100 dark:border-stone-800 pb-3 flex items-center gap-3">
          <span className="w-2.5 h-2.5 bg-yellow-500 rounded-sm" />
          Top Repositories
        </h3>
        <ul className="flex flex-col gap-4">
          {topRepos.map((repo, idx) => (
            <li key={repo.id} className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-400 w-5">
                #{idx + 1}
              </span>
              <img
                src={repo.ownerAvatar}
                className="w-8 h-8 rounded border border-stone-200 dark:border-stone-800 object-cover"
                alt=""
              />
              <div className="flex-1 min-w-0">
                <Link
                  href={repo.url}
                  target="_blank"
                  className="text-sm text-slate-900 dark:text-white font-bold truncate hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors block"
                >
                  {repo.name}
                </Link>
              </div>
              <span className="text-xs text-slate-500 font-mono font-medium">
                {(repo.stars / 1000).toFixed(1)}k
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Top Organizations */}
      <div className="bg-white dark:bg-[#111] border border-stone-200 dark:border-stone-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-5 border-b border-stone-100 dark:border-stone-800 pb-3 flex items-center gap-3">
          <span className="w-2.5 h-2.5 bg-blue-500 rounded-sm" />
          Top Organizations
        </h3>
        <ul className="flex flex-col gap-4">
          {topOrgs.map((org, idx) => (
            <li key={org} className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-400 w-5">
                #{idx + 1}
              </span>
              <div className="flex-1 min-w-0">
                <Link
                  href={`https://github.com/${org}`}
                  target="_blank"
                  className="text-sm text-slate-900 dark:text-white font-bold truncate hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors block"
                >
                  @{org}
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Fastest Growing */}
      <div className="bg-white dark:bg-[#111] border border-stone-200 dark:border-stone-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-5 border-b border-stone-100 dark:border-stone-800 pb-3 flex items-center gap-3">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm" />
          Fastest Growing
        </h3>
        <ul className="flex flex-col gap-4">
          {fastestGrowing.map((repo, idx) => (
            <li key={repo.id} className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-400 w-5">
                #{idx + 1}
              </span>
              <div className="flex-1 min-w-0">
                <Link
                  href={repo.url}
                  target="_blank"
                  className="text-sm text-slate-900 dark:text-white font-bold truncate hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors block"
                >
                  {repo.name}
                </Link>
              </div>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-medium">
                +{repo.weeklyGrowth}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
