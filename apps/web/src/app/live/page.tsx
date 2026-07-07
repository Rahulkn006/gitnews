"use client";

import Link from "next/link";
import { LiveSignal } from "@/data/liveSignals";
import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@v1/backend/convex/_generated/api";
import { mapLiveSignal } from "@/lib/data-mapper";

export default function LivePulsePage() {
  const [signals, setSignals] = useState<LiveSignal[]>([]);
  const dbRepos = useQuery(api.github.getLatestRepos);

  useEffect(() => {
    if (dbRepos === undefined) return;
    
    const liveSignals = dbRepos.map(mapLiveSignal);
    
    // Simulate initial load of 10 items
    setSignals(liveSignals.slice(0, 10));

    // Simulate streaming new data occasionally
    const interval = setInterval(() => {
      setSignals((prev) => {
        if (prev.length >= liveSignals.length) return prev;
        const nextSignal = liveSignals[prev.length];
        if (!nextSignal) return prev;
        return [nextSignal, ...prev];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [dbRepos]);

  if (dbRepos === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-[#0a0a0a]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
          <p className="text-slate-500 font-mono text-sm tracking-widest uppercase">Fetching Intelligence...</p>
        </div>
      </div>
    );
  }

  const getSentimentColor = (sentiment: string) => {
    if (sentiment === "positive") return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    if (sentiment === "negative") return "text-red-500 bg-red-500/10 border-red-500/20";
    return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
  };

  return (
    <div className="w-full min-h-screen bg-stone-50 text-slate-900 dark:bg-[#0a0a0a] dark:text-slate-200 font-sans px-4 md:px-8 py-8 selection:bg-emerald-500 selection:text-white">
      {/* Magazine Banner Navigation */}
      <nav className="max-w-7xl mx-auto flex items-center justify-between mb-12 pb-6 border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-serif text-3xl font-black tracking-tighter text-slate-900 dark:text-white">
            GitNews.
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500 dark:text-slate-400">
            <Link href="/trending" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Trending</Link>
            <Link href="/news" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">News</Link>
            <Link href="/analyze" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Analyzer</Link>
            <Link href="/live" className="text-emerald-600 dark:text-emerald-400 font-bold">Live Pulse</Link>
            <Link href="/ai" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">AI</Link>
            <Link href="/discover" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Discover</Link>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">System Status:</span>
          <span className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            LIVE
          </span>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto">
        <header className="mb-16 border-b border-stone-200 dark:border-stone-800 pb-10">
          <h1 className="text-5xl md:text-6xl font-serif font-black tracking-tight text-slate-900 dark:text-white mb-6 flex items-center gap-4">
            Developer Pulse
            <span className="inline-block w-4 h-4 bg-emerald-500 rounded-full animate-ping" />
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-xl font-serif">
            Real-time monitoring of repositories gaining attention across the developer ecosystem.
          </p>
        </header>

        <div className="flex flex-col gap-8">
          {signals.map((signal) => (
            <article 
              key={signal.id} 
              className="group animate-in fade-in slide-in-from-top-4 duration-500 border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#111] rounded-xl p-8 md:p-10 shadow-sm hover:shadow-md transition-all"
            >
              <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-10">
                
                {/* Main Info */}
                <div className="flex flex-col gap-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-orange-600 dark:text-orange-500 bg-orange-50 dark:bg-orange-500/10 px-2.5 py-1 rounded border border-orange-200 dark:border-orange-500/20">
                      Trending Now
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium font-sans">
                      {new Date(signal.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-5">
                    <img src={signal.ownerAvatar} alt="" className="w-12 h-12 rounded border border-stone-200 dark:border-stone-800 shadow-sm" />
                    <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                      <a href={`https://github.com/${signal.repository}`} target="_blank" rel="noreferrer">
                        {signal.repository}
                      </a>
                    </h2>
                  </div>

                  <div className="bg-stone-50 dark:bg-[#0a0a0a] border border-stone-100 dark:border-stone-800 p-6 rounded-xl mt-3">
                    <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
                      Why is this trending?
                    </span>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-sans text-base md:text-lg">
                      {signal.explanation}
                    </p>
                  </div>
                </div>

                {/* Metrics */}
                <div className="flex flex-col gap-5 md:border-l border-stone-100 dark:border-stone-800 md:pl-10">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Trending Score</span>
                    <span className="text-3xl font-serif font-black text-slate-900 dark:text-white">{signal.trendingScore}/100</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Mentions Today</span>
                    <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">+{signal.mentionsToday}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Sentiment</span>
                    <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded border ${getSentimentColor(signal.sentiment)}`}>
                      {signal.sentiment}
                    </span>
                  </div>

                  <div className="mt-5 pt-5 border-t border-stone-100 dark:border-stone-800">
                    <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
                      Sources
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {signal.sources.map((source) => (
                        <span key={source} className="text-[10px] font-medium font-sans px-2.5 py-1 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-slate-600 dark:text-slate-400 rounded">
                          {source}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
