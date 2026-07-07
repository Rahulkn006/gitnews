"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function BreakingTicker() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const breakingNews = [
    "🚀 Next.js gained 2500 stars today",
    "⚡ Major open source release detected: React 19 Beta",
    "🤖 New AI repository trending: OpenAI / SWE-bench",
    "📈 Vercel / v0 crosses 10k stars",
    "🚨 Security patch released for popular Node.js package",
  ];

  if (!mounted) return null;

  return (
    <div className="w-full bg-emerald-600 dark:bg-emerald-900 text-white overflow-hidden py-2 border-b border-emerald-700 dark:border-emerald-800 flex items-center relative h-10">
      <div className="bg-emerald-700 dark:bg-emerald-950 px-4 py-2 font-bold text-xs tracking-widest uppercase absolute left-0 z-10 flex items-center h-full shadow-[10px_0_20px_rgba(5,150,105,1)] dark:shadow-[10px_0_20px_rgba(2,44,34,1)]">
        <span className="animate-pulse mr-2 h-2 w-2 bg-red-500 rounded-full inline-block" />
        LIVE WIRE
      </div>
      
      {/* Marquee Animation */}
      <div className="flex whitespace-nowrap animate-marquee hover:pause pl-40">
        {[...breakingNews, ...breakingNews].map((news, i) => (
          <span key={i} className="mx-8 font-mono text-sm inline-flex items-center gap-2">
            <span className="text-emerald-200">•</span>
            {news}
          </span>
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .hover\\:pause:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
