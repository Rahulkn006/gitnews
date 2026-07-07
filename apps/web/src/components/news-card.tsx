"use client";

import { NewsItem } from "@/data/news";

interface NewsCardProps {
  article: NewsItem;
  isLead?: boolean;
}

export function NewsCard({ article, isLead = false }: NewsCardProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <article className={`group relative border-b border-stone-200 dark:border-stone-800 py-10 transition-all duration-300 hover:bg-stone-50/50 dark:hover:bg-[#111]/30 ${isLead ? "pb-12 pt-6" : ""}`}>
      <div className="absolute left-0 top-0 h-full w-1 bg-emerald-500 opacity-0 transition-opacity group-hover:opacity-100" />
      <a href={article.url} target="_blank" rel="noreferrer" className="block px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-[160px_1fr_120px] gap-8 items-start">
          
          {/* Metadata Column */}
          <div className="flex flex-col gap-4 mt-1">
            <div className="inline-flex max-w-fit items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20">
              {article.category}
            </div>
            <div className="flex flex-col gap-1.5 font-sans text-xs font-medium text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                {formatDate(article.date)}
              </span>
              <span className="truncate text-slate-400">@{article.repository.split('/')[0]}</span>
            </div>
          </div>

          {/* Main Content Column */}
          <div className="flex flex-col gap-4 min-w-0">
            <h2 className={`font-serif leading-snug tracking-tight text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors ${
              isLead ? "text-3xl md:text-5xl font-black" : "text-2xl md:text-3xl font-bold"
            }`}>
              {article.headline}
            </h2>
            <p className={`font-sans text-slate-600 dark:text-slate-400 leading-relaxed ${isLead ? "text-lg md:text-xl" : "text-base md:text-lg"}`}>
              {article.explanation}
            </p>
            <div className="mt-3 text-xs font-mono text-slate-500 flex items-center gap-4">
              <span className="px-3 py-1.5 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded text-slate-600 dark:text-slate-400 font-medium">
                Repo: {article.repository}
              </span>
            </div>
          </div>

          {/* Impact Score Column */}
          <div className="hidden md:flex flex-col items-end justify-start h-full mt-1">
            <div className="text-right">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">
                Impact Score
              </span>
              <span className={`font-serif text-4xl font-black tracking-tighter ${
                article.impactScore >= 90 ? "text-orange-500" : "text-emerald-500"
              }`}>
                {article.impactScore}
              </span>
            </div>
          </div>
          
        </div>
      </a>
    </article>
  );
}
