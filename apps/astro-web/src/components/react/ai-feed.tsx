import { useQuery } from "convex/react";
import { api } from "@v1/backend/convex/_generated/api";
import { RepoCard } from "./repo-card";
import { NewsCard } from "./news-card";
import { mapConvexRepo, mapConvexNews } from "@/lib/data-mapper";
import { withConvex } from "@/lib/convex";

export const AIFeed = withConvex(function AIFeed() {
  const dbRepos = useQuery(api.github.getReposByCategory, { category: "AI" });
  const dbNews = useQuery(api.news.getNews);

  if (dbRepos === undefined || dbNews === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-[#0a0a0a]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
          <p className="text-slate-500 font-mono text-sm tracking-widest uppercase">Fetching Intelligence...</p>
        </div>
      </div>
    );
  }

  const aiRepos = dbRepos.map(mapConvexRepo);
  const aiNews = dbNews.map(mapConvexNews).filter(n => n.category === "AI Projects" || n.headline.toLowerCase().includes("ai"))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="w-full min-h-screen bg-stone-50 text-slate-900 dark:bg-[#0a0a0a] dark:text-slate-200 font-sans px-4 md:px-8 py-8 selection:bg-emerald-500 selection:text-white">
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Left Column: AI Projects */}
        <div className="lg:col-span-8 flex flex-col gap-12">
          <header className="mb-8 border-b border-stone-200 dark:border-stone-800 pb-8">
            <h1 className="text-5xl md:text-6xl font-serif font-black tracking-tight text-slate-900 dark:text-white mb-6">
              Artificial Intelligence
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xl font-serif">
              The latest open-source LLMs, AI agents, and ML frameworks.
            </p>
          </header>

          <section>
            <h2 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-8 flex items-center gap-3 border-b border-stone-200 dark:border-stone-800 pb-4">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm" />
              TOP AI REPOSITORIES
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {aiRepos.map((repo) => (
                <RepoCard key={repo.id} repo={repo} size="medium" />
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: AI News */}
        <aside className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-stone-200 dark:border-stone-800 lg:pl-10">
          <h2 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-8 flex items-center gap-3 border-b border-stone-200 dark:border-stone-800 pb-4">
            <span className="w-2.5 h-2.5 bg-purple-500 rounded-sm" />
            AI NEWS & LAUNCHES
          </h2>
          <div className="flex flex-col">
            {aiNews.map((story) => (
              <div key={story.id} className="border-b border-stone-200 dark:border-stone-800 last:border-0 pb-4 mb-4">
                <NewsCard article={story} />
              </div>
            ))}
          </div>
        </aside>

      </main>
    </div>
  );
});
