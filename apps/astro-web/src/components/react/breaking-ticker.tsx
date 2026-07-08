"use client";

import { useEffect, useState } from "react";
import { RocketLaunch, Lightning, Brain, TrendUp, ShieldCheck } from "@phosphor-icons/react";

import { withConvex } from "@/lib/convex";

export const BreakingTicker = withConvex(function BreakingTicker() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const breakingNews = [
    { icon: <RocketLaunch className="w-4 h-4 text-white" weight="duotone" />, text: "Next.js gained 2500 stars today" },
    { icon: <Lightning className="w-4 h-4 text-emerald-300" weight="fill" />, text: "Major open source release detected: React 19 Beta" },
    { icon: <Brain className="w-4 h-4 text-purple-300" weight="duotone" />, text: "New AI repository trending: OpenAI / SWE-bench" },
    { icon: <TrendUp className="w-4 h-4 text-emerald-300" weight="bold" />, text: "Vercel / v0 crosses 10k stars" },
    { icon: <ShieldCheck className="w-4 h-4 text-rose-300" weight="fill" />, text: "Security patch released for popular Node.js package" },
  ];

  if (!mounted) return null;

  return (
    <div className="w-full bg-emerald-600 dark:bg-emerald-900 text-white overflow-hidden py-2 border-b border-emerald-700 dark:border-emerald-800 flex items-center relative h-10">
      <div className="bg-emerald-700 dark:bg-emerald-950 px-4 py-2 font-bold text-xs tracking-widest uppercase absolute left-0 z-10 flex items-center h-full shadow-[10px_0_20px_rgba(5,150,105,1)] dark:shadow-[10px_0_20px_rgba(2,44,34,1)]">
        <span className="animate-pulse mr-2 h-2 w-2 bg-red-500 rounded-full inline-block" />
        LIVE WIRE
      </div>
      
      {/* Marquee Animation — seamless loop with slow speed */}
      <div className="flex whitespace-nowrap pl-40 ticker-track">
        {[...breakingNews, ...breakingNews, ...breakingNews].map((news, i) => (
          <span key={i} className="mx-8 font-mono text-sm inline-flex items-center gap-2">
            <span className="text-emerald-200">•</span>
            <span className="inline-flex items-center gap-1.5">
              {news.icon}
              <span>{news.text}</span>
            </span>
          </span>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .ticker-track {
          animation: ticker-scroll 60s linear infinite;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
      `}} />
    </div>
  );
});

