"use client";

import {
  Brain,
  Lightning,
  RocketLaunch,
  ShieldCheck,
  TrendUp,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";

import { withConvex } from "@/lib/convex";
import { type AINewsItem, newsService } from "@/services/news";
import { NewsDetailModal } from "./news-detail-modal";

export const BreakingTicker = withConvex(function BreakingTicker() {
  const [mounted, setMounted] = useState(false);
  const [liveNews, setLiveNews] = useState<AINewsItem[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<AINewsItem | null>(
    null,
  );

  useEffect(() => {
    setMounted(true);
    // Fetch live news for the ticker
    newsService.getLatestAINews().then(setLiveNews).catch(console.error);
  }, []);

  const defaultNews = [
    {
      type: "mock",
      icon: <RocketLaunch className="w-4 h-4 text-white" weight="duotone" />,
      text: "Next.js gained 2500 stars today",
    },
    {
      type: "mock",
      icon: <Lightning className="w-4 h-4 text-emerald-300" weight="fill" />,
      text: "Major open source release detected: React 19 Beta",
    },
    {
      type: "mock",
      icon: <Brain className="w-4 h-4 text-purple-300" weight="duotone" />,
      text: "New AI repository trending: OpenAI / SWE-bench",
    },
    {
      type: "mock",
      icon: <TrendUp className="w-4 h-4 text-emerald-300" weight="bold" />,
      text: "Vercel / v0 crosses 10k stars",
    },
    {
      type: "mock",
      icon: <ShieldCheck className="w-4 h-4 text-rose-300" weight="fill" />,
      text: "Security patch released for popular Node.js package",
    },
  ];

  const realNewsTicker = liveNews.map((article) => ({
    type: "real",
    icon: <Lightning className="w-4 h-4 text-amber-300" weight="fill" />,
    text: `Trending: ${article.title}`,
    article,
  }));

  const allNews = [...defaultNews, ...realNewsTicker];
  // Triple the array to ensure smooth marquee loop
  const tickerItems = [...allNews, ...allNews, ...allNews];

  if (!mounted) return null;

  return (
    <>
      <div className="w-full bg-emerald-600 dark:bg-emerald-900 text-white overflow-hidden py-2 border-b border-emerald-700 dark:border-emerald-800 flex items-center relative h-10 group">
        <div className="bg-emerald-700 dark:bg-emerald-950 px-4 py-2 font-bold text-xs tracking-widest uppercase absolute left-0 z-10 flex items-center h-full shadow-[10px_0_20px_rgba(5,150,105,1)] dark:shadow-[10px_0_20px_rgba(2,44,34,1)]">
          <span className="animate-pulse mr-2 h-2 w-2 bg-red-500 rounded-full inline-block" />
          LIVE WIRE
        </div>

        {/* Marquee Animation — seamless loop with slow speed */}
        <div className="flex whitespace-nowrap pl-40 ticker-track group-hover:[animation-play-state:paused]">
          {tickerItems.map((news, i) => (
            <span
              key={i}
              className="mx-8 font-mono text-sm inline-flex items-center gap-2"
            >
              <span className="text-emerald-200">•</span>
              {news.type === "real" ? (
                <button
                  onClick={() => setSelectedArticle((news as any).article)}
                  className="inline-flex items-center gap-1.5 hover:text-amber-200 transition-colors"
                >
                  {news.icon}
                  <span className="cursor-pointer underline decoration-amber-500/30 underline-offset-4 hover:decoration-amber-400">
                    {news.text}
                  </span>
                </button>
              ) : (
                <span className="inline-flex items-center gap-1.5 cursor-default hover:text-emerald-200 transition-colors">
                  {news.icon}
                  <span>{news.text}</span>
                </span>
              )}
            </span>
          ))}
        </div>

        <style
          dangerouslySetInnerHTML={{
            __html: `
          @keyframes ticker-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.333%); }
          }
          .ticker-track {
            animation: ticker-scroll 60s linear infinite;
          }
        `,
          }}
        />
      </div>

      {selectedArticle && (
        <NewsDetailModal
          article={selectedArticle}
          isOpen={true}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </>
  );
});
