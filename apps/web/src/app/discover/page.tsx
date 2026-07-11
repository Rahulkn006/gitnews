"use client";

import { Leaderboards } from "@/components/leaderboards";
import { RepoCard } from "@/components/repo-card";
import { mapConvexRepo } from "@/lib/data-mapper";
import { api } from "@v1/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import Link from "next/link";
import { useState } from "react";

export default function DiscoverPage() {
  const [search, setSearch] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("All");

  const dbRepos = useQuery(api.github.getLatestRepos);

  if (dbRepos === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-[#0a0a0a]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
          <p className="text-slate-500 font-mono text-sm tracking-widest uppercase">
            Fetching Intelligence...
          </p>
        </div>
      </div>
    );
  }

  const allRepos = dbRepos.map(mapConvexRepo);
  const languages = [
    "All",
    "TypeScript",
    "JavaScript",
    "Rust",
    "Python",
    "Go",
    "C++",
    "C",
    "Java",
  ];

  const filteredRepos = allRepos.filter((repo) => {
    const matchesSearch =
      repo.name.toLowerCase().includes(search.toLowerCase()) ||
      repo.description.toLowerCase().includes(search.toLowerCase());
    const matchesLang =
      selectedLanguage === "All" || repo.language === selectedLanguage;
    return matchesSearch && matchesLang;
  });

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
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
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
              className="text-emerald-600 dark:text-emerald-400 font-bold"
            >
              Discover
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left Column: Discover Interface */}
        <div className="lg:col-span-8 flex flex-col gap-12">
          <header className="mb-4 border-b border-stone-200 dark:border-stone-800 pb-8">
            <h1 className="text-5xl md:text-6xl font-serif font-black tracking-tight text-slate-900 dark:text-white mb-6">
              Discover
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xl font-serif">
              Search and filter through the global open-source ecosystem.
            </p>
          </header>

          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-[#111] p-6 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm">
            <input
              type="text"
              placeholder="Search repositories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-stone-50 dark:bg-[#0a0a0a] border border-stone-200 dark:border-stone-800 rounded-lg px-5 py-3 text-base text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-sans"
            />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-stone-50 dark:bg-[#0a0a0a] border border-stone-200 dark:border-stone-800 rounded-lg px-5 py-3 text-base text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all min-w-[180px] font-sans cursor-pointer"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          {/* Results */}
          <div>
            <h2 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6">
              {filteredRepos.length} Results Found
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredRepos.map((repo) => (
                <RepoCard key={repo.id} repo={repo} size="medium" />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Leaderboards */}
        <aside className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-stone-200 dark:border-stone-800 lg:pl-10">
          <h2 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-8 flex items-center gap-3 border-b border-stone-200 dark:border-stone-800 pb-4">
            🏆 GITHUB LEADERBOARDS
          </h2>
          <Leaderboards />
        </aside>
      </main>
    </div>
  );
}
