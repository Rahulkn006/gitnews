"use client";

import { mapConvexRepo } from "@/lib/data-mapper";
import { api } from "@v1/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import Link from "next/link";
import { useState } from "react";

export default function AnalyzePage() {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const dbRepos = useQuery(api.github.getLatestRepos);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || dbRepos === undefined) return;

    setIsAnalyzing(true);

    // Mock analysis delay
    setTimeout(() => {
      const allRepos = dbRepos.map(mapConvexRepo);
      // Find repo from convex data or just mock the result
      const repoName = url.split("github.com/")[1] || "unknown/repo";
      const foundRepo = allRepos.find((r) => r.url.includes(repoName));

      setResult({
        name: foundRepo ? foundRepo.name : repoName.split("/")[1] || "Repo",
        owner: foundRepo ? foundRepo.owner : repoName.split("/")[0] || "Owner",
        health: {
          codeActivity: Math.floor(Math.random() * 20) + 80, // 80-100%
          community: Math.floor(Math.random() * 20) + 75,
          maintenance: Math.floor(Math.random() * 15) + 85,
        },
        stats: {
          recentCommits: Math.floor(Math.random() * 500) + 50,
          contributors: Math.floor(Math.random() * 100) + 10,
          openIssues: Math.floor(Math.random() * 300) + 20,
        },
        techStack: foundRepo
          ? foundRepo.topics
          : ["typescript", "react", "nodejs", "docker"],
      });

      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="w-full min-h-screen bg-stone-50 text-slate-900 dark:bg-[#0a0a0a] dark:text-slate-200 font-sans px-4 md:px-8 py-8 selection:bg-emerald-500 selection:text-white">
      {/* Magazine Banner Navigation */}
      <nav className="max-w-7xl mx-auto flex items-center justify-between mb-12 pb-6 border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="font-serif text-3xl font-black tracking-tighter text-slate-900 dark:text-white"
          >
            GitNews.
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500 dark:text-slate-400">
            <Link
              href="/trending"
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              Trending
            </Link>
            <Link
              href="/news"
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              News
            </Link>
            <Link
              href="/analyze"
              className="text-emerald-600 dark:text-emerald-400 font-bold"
            >
              Analyzer
            </Link>
            <Link
              href="/live"
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              Live Pulse
            </Link>
            <Link
              href="/ai"
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              AI
            </Link>
            <Link
              href="/discover"
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              Discover
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-black tracking-tight text-slate-900 dark:text-white mb-6">
            Repository Analyzer
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-xl font-serif">
            Deep dive into any GitHub repository to assess health, activity, and
            technical stack.
          </p>
        </header>

        {/* Input Section */}
        <div className="max-w-2xl mx-auto mb-16">
          <form onSubmit={handleAnalyze} className="relative">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste GitHub URL (e.g. github.com/facebook/react)"
              className="w-full bg-white dark:bg-[#111] border border-stone-200 dark:border-stone-800 rounded-lg py-4 pl-6 pr-32 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-sm font-sans text-base"
            />
            <button
              type="submit"
              disabled={isAnalyzing || !url}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-6 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {isAnalyzing ? "Analyzing..." : "Analyze"}
            </button>
          </form>
        </div>

        {/* Results Dashboard */}
        {result && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#111] rounded-xl p-8 md:p-12 shadow-sm">
              <div className="flex items-center gap-6 mb-10 border-b border-stone-100 dark:border-stone-800 pb-8">
                <div className="w-20 h-20 rounded border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 flex items-center justify-center text-4xl font-serif font-black text-slate-400">
                  {result.owner[0].toUpperCase()}
                </div>
                <div>
                  <h2 className="text-4xl font-serif font-black text-slate-900 dark:text-white mb-1">
                    {result.name}
                  </h2>
                  <p className="text-slate-500 font-medium">@{result.owner}</p>
                </div>
              </div>

              {/* Health Meters */}
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6">
                Repository Health
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-stone-50 dark:bg-[#0a0a0a] border border-stone-200 dark:border-stone-800 p-5 rounded-xl">
                  <div className="flex justify-between items-end mb-3">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Code Activity
                    </span>
                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                      {result.health.codeActivity}%
                    </span>
                  </div>
                  <div className="w-full bg-stone-200 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${result.health.codeActivity}%` }}
                    />
                  </div>
                </div>
                <div className="bg-stone-50 dark:bg-[#0a0a0a] border border-stone-200 dark:border-stone-800 p-5 rounded-xl">
                  <div className="flex justify-between items-end mb-3">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Community
                    </span>
                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                      {result.health.community}%
                    </span>
                  </div>
                  <div className="w-full bg-stone-200 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${result.health.community}%` }}
                    />
                  </div>
                </div>
                <div className="bg-stone-50 dark:bg-[#0a0a0a] border border-stone-200 dark:border-stone-800 p-5 rounded-xl">
                  <div className="flex justify-between items-end mb-3">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Maintenance
                    </span>
                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                      {result.health.maintenance}%
                    </span>
                  </div>
                  <div className="w-full bg-stone-200 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${result.health.maintenance}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Stats & Stack */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6 border-b border-stone-200 dark:border-stone-800 pb-3">
                    Activity Overview
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex justify-between items-center text-sm border-b border-stone-100 dark:border-stone-800 pb-3">
                      <span className="text-slate-600 dark:text-slate-400 font-medium">
                        Recent Commits
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {result.stats.recentCommits}
                      </span>
                    </li>
                    <li className="flex justify-between items-center text-sm border-b border-stone-100 dark:border-stone-800 pb-3">
                      <span className="text-slate-600 dark:text-slate-400 font-medium">
                        Active Contributors
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {result.stats.contributors}
                      </span>
                    </li>
                    <li className="flex justify-between items-center text-sm border-b border-stone-100 dark:border-stone-800 pb-3">
                      <span className="text-slate-600 dark:text-slate-400 font-medium">
                        Open Issues
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {result.stats.openIssues}
                      </span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6 border-b border-stone-200 dark:border-stone-800 pb-3">
                    Technology Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.techStack.map((tech: string) => (
                      <span
                        key={tech}
                        className="px-3 py-1.5 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-md text-xs font-medium text-slate-600 dark:text-slate-400"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
