import React from "react";

type PulseEvent = {
  id: string;
  timeAgo: string;
  repo: string;
  event: string;
  detail: string;
  tone: "neutral" | "positive" | "warning";
};

const MOCK_EVENTS: PulseEvent[] = [
  {
    id: "1",
    timeAgo: "5 minutes ago",
    repo: "vercel/next.js",
    event: "+800 stars today",
    detail: "Major release detected",
    tone: "positive",
  },
  {
    id: "2",
    timeAgo: "12 minutes ago",
    repo: "astral-sh/uv",
    event: "Trending #1 in Python",
    detail: "Extremely high community velocity",
    tone: "positive",
  },
  {
    id: "3",
    timeAgo: "1 hour ago",
    repo: "facebook/react",
    event: "New breaking changes",
    detail: "React 19 RC discussions peaking",
    tone: "warning",
  },
  {
    id: "4",
    timeAgo: "3 hours ago",
    repo: "anthropics/claude-code",
    event: "Launch trending",
    detail: "Over 5k forks in 24 hours",
    tone: "positive",
  },
];

import { withConvex } from "@/lib/convex";

export const GithubPulse = withConvex(function GithubPulse() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
        <h3 className="font-mono text-sm font-bold tracking-widest text-slate-500 uppercase">
          Ecosystem Pulse
        </h3>
      </div>
      
      <div className="relative border-l border-stone-200 dark:border-stone-800 ml-1.5 pl-6 flex flex-col gap-8">
        {MOCK_EVENTS.map((evt) => (
          <div key={evt.id} className="relative">
            {/* Timeline dot */}
            <div className={`absolute -left-[29px] top-1 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-[#0a0a0a] ${evt.tone === 'positive' ? 'bg-emerald-500' : evt.tone === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`} />
            
            <div className="text-[10px] text-slate-400 font-mono tracking-widest uppercase mb-1">
              {evt.timeAgo}
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="inline-block px-2 py-0.5 bg-stone-100 dark:bg-stone-900 rounded text-xs font-mono font-bold text-slate-700 dark:text-slate-300 w-max border border-stone-200 dark:border-stone-800">
                {evt.repo}
              </span>
              <h4 className="font-bold text-slate-900 dark:text-white mt-1">
                {evt.event}
              </h4>
              <p className="text-sm text-slate-500 font-serif">
                {evt.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
