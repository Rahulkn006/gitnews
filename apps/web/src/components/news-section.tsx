"use client";

import { useQuery } from "convex/react";
import { api } from "@v1/backend/convex/_generated/api";
import Link from "next/link";
import { NewsCard } from "./news-card";
import { mapConvexNews } from "@/lib/data-mapper";

export function NewsSection() {
  const dbNews = useQuery(api.news.getNews);

  if (dbNews === undefined) {
    return (
      <div className="py-16 flex justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  const newsArticles = dbNews.map(mapConvexNews).slice(0, 4);

  const tickerItems = [
    "Study finds code cleanliness impacts autonomous coding agents' performance",
    "GPT-5.6 Sol Ultra integrated into Codex platform",
    "Orbital seeks FCC approval for 100,000 satellites to power space AI data centres",
    "OpenAI proposes donating 5% equity to US sovereign wealth fund",
  ];

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 md:px-8">
      <div className="border-y-2 border-border py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10 font-mono text-xs text-muted-foreground">
        <div>VOL. I · ISSUE 42</div>
        <div className="text-foreground font-bold tracking-widest uppercase">
          GITNEWS INTELLIGENCE REPORT
        </div>
        <Link href="/news" className="hover:text-primary transition-colors flex items-center gap-1">
          VIEW WIRE FEED →
        </Link>
      </div>

      <div className="flex flex-col">
        {newsArticles.map((article: any, index: number) => (
          <NewsCard key={article._id || article.id} article={article} isLead={index === 0} />
        ))}
      </div>

      <div className="mt-16 border border-border bg-card/40 py-3.5 px-4 overflow-hidden relative font-mono text-[11px] text-muted-foreground flex items-center gap-4">
        <div className="text-primary font-bold shrink-0 border-r border-border pr-4 select-none">
          ▸ WIRE
        </div>
        <div className="relative flex overflow-x-hidden w-full">
          <div className="flex items-center space-x-12 animate-marquee whitespace-nowrap">
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <span key={i}>{item}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
