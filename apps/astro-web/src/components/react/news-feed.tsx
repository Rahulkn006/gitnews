import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { NewsCard } from "./news-card";
import { mapConvexNews } from "@/lib/data-mapper";
import { withConvex } from "@/lib/convex";

export const NewsFeed = withConvex(function NewsFeed() {
  const { data: dbNews } = useSWR('http://localhost:3001/api/news', fetcher);

  if (dbNews === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-[#0a0a0a]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
          <p className="text-slate-500 font-mono text-sm tracking-widest uppercase">Fetching Intelligence...</p>
        </div>
      </div>
    );
  }

  const sortedNews = dbNews.map(mapConvexNews).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const leadStory = sortedNews[0];
  const otherStories = sortedNews.slice(1);

  return (
    <div className="w-full min-h-screen bg-stone-50 text-slate-900 dark:bg-[#0a0a0a] dark:text-slate-200 font-sans px-4 md:px-8 py-8 selection:bg-emerald-500 selection:text-white">
      <main className="max-w-4xl mx-auto">
        <header className="mb-16 border-b border-stone-300 dark:border-stone-800 pb-10 text-center">
          <h1 className="font-serif text-6xl md:text-8xl font-black tracking-tight text-slate-900 dark:text-white mb-6 uppercase">
            The Chronicle
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xl md:text-2xl font-serif">
            Latest releases, breaking changes, and critical updates from the open-source ecosystem.
          </p>
        </header>

        <div className="flex flex-col">
          {/* Lead Story */}
          {leadStory && (
            <div className="mb-12">
              <h2 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-3">
                <span className="w-2.5 h-2.5 bg-red-500 animate-pulse rounded-full" />
                TOP STORY
              </h2>
              <NewsCard article={leadStory} isLead={true} />
            </div>
          )}

          {/* Other Stories */}
          <div>
            <h2 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6 mt-12 flex items-center gap-3 border-b border-stone-200 dark:border-stone-800 pb-3">
              LATEST UPDATES
            </h2>
            <div className="flex flex-col">
              {otherStories.map((story) => (
                <NewsCard key={story.id} article={story} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
});
