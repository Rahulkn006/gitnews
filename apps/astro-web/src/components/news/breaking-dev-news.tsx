"use client";

import React from "react";
import { DEVELOPER_NEWS_DATA } from "@/data/developer-news";

export function BreakingDevNews() {
  const data = DEVELOPER_NEWS_DATA;

  return (
    <div className="flex flex-col gap-8 mt-6">
      {/* SECTION 1: LIVE DEV WIRE */}
      <div className="flex flex-col gap-0 border-t-2 border-black dark:border-white pt-2">
        <h3 className="font-serif font-black uppercase text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-2 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
          Live Dev Wire
        </h3>
        <div className="flex flex-col gap-3">
          {data.liveWire.map((news) => (
            <div key={news.id} className="flex flex-col gap-1 pb-3 border-b border-stone-200 dark:border-stone-800 last:border-0">
              <div className="flex items-start gap-2.5">
                <span className="text-sm shrink-0 mt-0.5">{news.icon}</span>
                <div className="flex flex-col gap-1 min-w-0">
                  <a href="#" className="font-bold text-sm text-slate-900 dark:text-white leading-tight hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors line-clamp-2">
                    {news.headline}
                  </a>
                  <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-500 uppercase tracking-widest mt-0.5">
                    <span className="truncate">{news.source}</span>
                    <span className="shrink-0">•</span>
                    <span className="shrink-0">{news.timestamp}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: NEW RELEASES */}
      <div className="flex flex-col gap-0 border-t-2 border-black dark:border-white pt-2">
        <h3 className="font-serif font-black uppercase text-sm tracking-tight text-slate-900 dark:text-white mb-3">
          New Releases
        </h3>
        <div className="flex flex-col gap-1">
          {data.latestReleases.map((release) => (
            <div key={release.id} className="flex items-center justify-between py-2 border-b border-stone-100 dark:border-stone-800/50 last:border-0 group">
              <div className="flex flex-col min-w-0 pr-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                  {release.project}
                </span>
                <span className="text-[10px] font-mono text-slate-500 truncate mt-0.5">
                  {release.version}
                </span>
              </div>
              <span className="text-[9px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded shrink-0">
                {release.signal}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: SECURITY RADAR */}
      <div className="flex flex-col gap-0 border-t-2 border-black dark:border-white pt-2">
        <h3 className="font-serif font-black uppercase text-sm tracking-tight text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <span className="text-rose-500">🛡</span> Security Radar
        </h3>
        <div className="flex flex-col gap-2">
          {data.securityWatch.map((sec) => (
            <div key={sec.id} className="flex flex-col p-2.5 bg-stone-50 dark:bg-[#111] border border-stone-200 dark:border-stone-800 rounded">
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400 mb-1">
                {sec.alert}
              </span>
              <span className="text-[10px] text-slate-600 dark:text-slate-400 font-mono leading-relaxed">
                {sec.description}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
