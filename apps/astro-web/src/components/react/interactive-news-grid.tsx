import type { AINewsItem } from "@/services/news";
import React, { useState, useMemo } from "react";
import { NewsDetailModal } from "./news-detail-modal";

interface Props {
  initialNews: AINewsItem[];
}

const CATEGORIES = [
  "All News",
  "AI Models",
  "Developer Tools",
  "Open Source",
  "Research",
  "Startups",
  "GitHub",
];

export function InteractiveNewsGrid({ initialNews }: Props) {
  const [activeCategory, setActiveCategory] = useState("All News");
  const [selectedArticle, setSelectedArticle] = useState<AINewsItem | null>(
    null,
  );

  const filteredNews = useMemo(() => {
    if (activeCategory === "All News") return initialNews;
    return initialNews.filter((n) => n.category === activeCategory);
  }, [initialNews, activeCategory]);

  const featuredStories = filteredNews.slice(0, 2);
  const latestStories = filteredNews.slice(2);

  return (
    <div>
      {/* Category Filter Bar */}
      <div className="flex overflow-x-auto gap-2 pb-4 mb-8 scrollbar-hide border-b border-stone-200 dark:border-stone-800">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 whitespace-nowrap text-xs font-mono font-bold uppercase tracking-widest rounded-full transition-all ${
              activeCategory === category
                ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                : "bg-stone-100 dark:bg-stone-900/50 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-9 gap-12">
        {/* Left: Featured Stories */}
        <div className="lg:col-span-4 flex flex-col gap-10">
          <h2 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-2 border-b border-stone-200 dark:border-stone-800 pb-3">
            FEATURED STORIES
          </h2>

          {featuredStories.length === 0 && (
            <p className="text-stone-500 font-serif italic">
              No featured stories in this category.
            </p>
          )}

          <div className="flex flex-col gap-10">
            {featuredStories.map((story) => (
              <button
                key={story.id}
                onClick={() => setSelectedArticle(story)}
                className="text-left group block p-4 -m-4 hover:bg-stone-100 dark:hover:bg-stone-900/50 rounded-xl transition-colors"
              >
                <div className="relative overflow-hidden rounded-lg bg-stone-200 dark:bg-stone-800 w-full h-64 md:h-80 mb-6">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 bg-black/80 backdrop-blur text-white text-[10px] font-mono font-bold uppercase tracking-widest rounded shadow-sm">
                      {story.category}
                    </span>
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-slate-500 mb-3">
                    <span className="text-stone-900 dark:text-stone-300">
                      {story.source}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-stone-300 dark:bg-stone-700"></span>
                    <span>{story.publishedAt}</span>
                  </div>
                  <h3 className="text-2xl md:text-4xl font-serif font-black tracking-tight text-slate-900 dark:text-white mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-tight">
                    {story.title}
                  </h3>
                  <p className="text-base md:text-lg text-stone-600 dark:text-stone-400 leading-relaxed font-sans">
                    {story.summary}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Latest Stories list */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          <h2 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-2 border-b border-stone-200 dark:border-stone-800 pb-3">
            LATEST UPDATES
          </h2>

          {latestStories.length === 0 && (
            <p className="text-stone-500 font-serif italic">
              No more stories in this category.
            </p>
          )}

          <div className="flex flex-col gap-4">
            {latestStories.map((story) => (
              <button
                key={story.id}
                onClick={() => setSelectedArticle(story)}
                className="text-left group flex flex-col md:flex-row gap-6 items-start p-4 -m-4 hover:bg-stone-100 dark:hover:bg-stone-900/50 rounded-xl transition-colors"
              >
                <div className="relative overflow-hidden rounded-lg bg-stone-200 dark:bg-stone-800 w-full md:w-48 h-48 md:h-32 shrink-0">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 bg-black/80 backdrop-blur text-white text-[10px] font-mono font-bold uppercase tracking-widest rounded shadow-sm">
                      {story.category}
                    </span>
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-slate-500 mb-3">
                    <span className="text-stone-900 dark:text-stone-300">
                      {story.source}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-stone-300 dark:bg-stone-700"></span>
                    <span>{story.publishedAt}</span>
                  </div>
                  <h3 className="text-xl font-serif font-black tracking-tight text-slate-900 dark:text-white mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-tight">
                    {story.title}
                  </h3>
                  <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed font-sans line-clamp-2">
                    {story.summary}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {selectedArticle && (
        <NewsDetailModal
          article={selectedArticle}
          isOpen={true}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </div>
  );
}
