import type { LiveSignal } from "@/data/liveSignals";

import { mapLiveSignal } from "@/lib/data-mapper";
import { fetcher } from "@/lib/api";
import { useEffect, useState } from "react";
import useSWR from "swr";

export function LivePulseFeed() {
  const [signals, setSignals] = useState<LiveSignal[]>([]);
  const [timeFilter, setTimeFilter] = useState<
    "Last hour" | "Today" | "This week"
  >("Today");
  const { data: dbRepos } = useSWR(
    "/api/repositories?type=latest",
    fetcher,
  );

  useEffect(() => {
    if (dbRepos === undefined) return;

    const liveSignals = dbRepos.map(mapLiveSignal);

    setSignals(liveSignals.slice(0, 10));

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
          <p className="text-slate-500 font-mono text-sm tracking-widest uppercase">
            Fetching Intelligence...
          </p>
        </div>
      </div>
    );
  }

  const getSentimentColor = (sentiment: string) => {
    if (sentiment === "positive")
      return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    if (sentiment === "negative")
      return "text-red-500 bg-red-500/10 border-red-500/20";
    return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
  };

  const getImportanceColor = (importance: string) => {
    if (importance === "High")
      return "text-red-500 bg-red-500/10 border-red-500/20";
    if (importance === "Medium")
      return "text-orange-500 bg-orange-500/10 border-orange-500/20";
    return "text-blue-500 bg-blue-500/10 border-blue-500/20";
  };

  const filteredSignals = signals.filter((signal) => {
    const signalDate = new Date(signal.timestamp);
    const now = new Date();
    const hoursDiff = (now.getTime() - signalDate.getTime()) / (1000 * 60 * 60);

    if (timeFilter === "Last hour") return hoursDiff <= 1;
    if (timeFilter === "Today") return hoursDiff <= 24;
    return true; // This week
  });

  return (
    <div className="w-full min-h-screen bg-stone-50 text-slate-900 dark:bg-[#0a0a0a] dark:text-slate-200 font-sans px-4 md:px-8 py-8 selection:bg-emerald-500 selection:text-white">
      <main className="max-w-5xl mx-auto">
        <header className="mb-8 border-b border-stone-200 dark:border-stone-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-black tracking-tight text-slate-900 dark:text-white mb-4 flex items-center gap-4">
              Developer Pulse
              <span className="inline-block w-3 h-3 bg-emerald-500 rounded-full animate-ping" />
            </h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-lg font-serif">
              Real-time monitoring of repositories gaining attention across the
              developer ecosystem.
            </p>
          </div>
          <div className="flex gap-2">
            {(["Last hour", "Today", "This week"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-widest rounded border transition-colors ${
                  timeFilter === filter
                    ? "bg-emerald-500 text-white border-emerald-500"
                    : "bg-white dark:bg-[#111] text-slate-500 border-stone-200 dark:border-stone-800 hover:border-emerald-500/50"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </header>

        <div className="flex flex-col gap-4">
          {filteredSignals.map((signal, i) => (
            <article
              key={signal.id}
              className="group animate-in fade-in slide-in-from-top-4 duration-500 border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#111] rounded-lg p-5 md:p-6 shadow-sm hover:shadow-md transition-all"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="grid grid-cols-1 md:grid-cols-[1fr_250px] gap-6 items-center">
                {/* Main Info */}
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-500/20">
                      {signal.eventType}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getImportanceColor(signal.importance)}`}
                    >
                      {signal.importance}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium font-sans ml-2">
                      {new Date(signal.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <img
                      src={signal.ownerAvatar}
                      alt=""
                      className="w-8 h-8 rounded border border-stone-200 dark:border-stone-800 shadow-sm"
                    />
                    <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                      <a
                        href={`https://github.com/${signal.repository}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {signal.repository}
                      </a>
                    </h2>
                  </div>

                  <p className="text-slate-600 dark:text-slate-300 leading-snug font-sans text-sm mt-1">
                    {signal.explanation}
                  </p>
                </div>

                {/* Metrics */}
                <div className="flex flex-col gap-3 md:border-l border-stone-100 dark:border-stone-800 md:pl-6 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Trending
                    </span>
                    <span className="font-serif font-black text-slate-900 dark:text-white">
                      {signal.trendingScore}/100
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Mentions
                    </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      +{signal.mentionsToday}
                    </span>
                  </div>

                  <div className="mt-1 flex gap-1.5 flex-wrap">
                    {signal.sources.map((source) => (
                      <span
                        key={source}
                        className="text-[9px] font-medium font-sans px-1.5 py-0.5 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-slate-600 dark:text-slate-400 rounded"
                      >
                        {source}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
          {filteredSignals.length === 0 && (
            <div className="py-12 text-center border border-dashed border-stone-200 dark:border-stone-800 rounded-lg text-slate-500 font-mono text-sm">
              No live mentions found for this timeframe.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
