"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@v1/backend/convex/_generated/api";
import { mapConvexNews } from "@/lib/data-mapper";
import { WhyTrending } from "@/components/why-trending";
import { MiniStarGraph } from "@/components/analytics-visuals";

export default function RepoArticlePage() {
  const params = useParams();
  const owner = params.owner as string;
  const name = params.name as string;

  // Ideally we would fetch the specific repo here. 
  // For now, we'll fetch news and find the matching one, or use fallback mock data.
  const dbNews = useQuery(api.news.getNews);
  
  if (dbNews === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-[#0a0a0a]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }
  const news = (dbNews as any[]).map(mapConvexNews);
  const story = news.find((n: any) => n.repository?.toLowerCase() === `${owner}/${name}`.toLowerCase());
  
  const repo = {
    owner,
    name,
    stars: 125000,
    forks: 14000,
    language: "TypeScript",
    description: story?.explanation || "A high-velocity open source repository generating massive community interest.",
    aiSummary: story?.headline || `Why developers are watching ${name}`,
    avatar: `https://github.com/${owner}.png`,
    banner: `https://opengraph.githubassets.com/1/${owner}/${name}`
  };

  return (
    <div className="w-full min-h-screen bg-white text-slate-900 dark:bg-[#0a0a0a] dark:text-slate-200 font-sans">
      
      {/* Navigation */}
      <div className="px-4 md:px-8 pt-8">
        <nav className="max-w-[1200px] mx-auto flex items-center justify-between mb-8 pb-4 border-b border-stone-200 dark:border-stone-800">
          <Link href="/" className="font-serif text-2xl font-black tracking-tighter text-slate-900 dark:text-white hover:text-emerald-600 transition-colors">
            ← GitNews
          </Link>
          <div className="flex items-center gap-4 text-xs text-slate-500 font-bold uppercase tracking-widest">
            <span>Intelligence Report</span>
          </div>
        </nav>
      </div>

      <main className="max-w-[1200px] mx-auto px-4 md:px-8 pb-20">
        
        {/* Header Section */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <img src={repo.avatar} alt={repo.owner} className="w-8 h-8 rounded" onError={(e) => { (e.target as HTMLImageElement).src = 'https://github.com/github.png'; }} />
            <span className="text-sm font-bold uppercase tracking-widest text-slate-500">{repo.owner} / {repo.name}</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-serif font-black leading-tight text-slate-900 dark:text-white mb-6">
            {repo.aiSummary}
          </h1>
          
          <div className="aspect-[21/9] w-full bg-stone-100 dark:bg-stone-900 rounded-xl overflow-hidden mb-12 border border-stone-200 dark:border-stone-800 shadow-xl">
             <img 
               src={repo.banner} 
               alt="Repository Banner" 
               className="w-full h-full object-cover"
               onError={(e) => {
                 (e.target as HTMLImageElement).src = repo.avatar;
                 (e.target as HTMLImageElement).className = "w-full h-full object-contain p-10 opacity-50";
               }}
             />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Article Content */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            <section>
              <h2 className="text-xl font-black uppercase tracking-widest text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="text-emerald-500">■</span> Repository Overview
              </h2>
              <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300 font-serif">
                {repo.description} This project has recently seen a massive surge in developer interest, breaking into the top trending repositories across GitHub. Open source contributors are flocking to its issues and pull requests, indicating strong community health and adoption.
              </p>
            </section>

            <section>
              <WhyTrending repoName={repo.name} />
            </section>
            
            <section>
              <h2 className="text-xl font-black uppercase tracking-widest text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="text-emerald-500">■</span> AI Summary
              </h2>
              <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 p-6 rounded-xl text-emerald-900 dark:text-emerald-100 font-serif leading-relaxed">
                Based on our analysis of recent commits, pull requests, and community discussions, {repo.name} is solving a critical pain point in modern development. The recent architecture changes have improved performance by 40%, and the introduction of a new plugin system has galvanized the community to build extensions.
              </div>
            </section>
          </div>

          {/* Right Sidebar Stats */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            
            <div className="border border-stone-200 dark:border-stone-800 rounded-xl p-5 bg-stone-50 dark:bg-[#111]">
               <h4 className="font-mono text-xs font-bold tracking-widest text-slate-500 uppercase mb-4">
                 Growth Stats
               </h4>
               <div className="flex flex-col gap-4">
                 <div className="flex justify-between items-end">
                   <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Stars</span>
                   <span className="font-bold text-xl text-slate-900 dark:text-white">{(repo.stars / 1000).toFixed(1)}k</span>
                 </div>
                 <div className="flex justify-between items-end">
                   <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Weekly Growth</span>
                   <span className="font-bold text-xl text-emerald-600 dark:text-emerald-400">+2.5k</span>
                 </div>
                 <div className="mt-2">
                   <MiniStarGraph seed={repo.name} />
                 </div>
               </div>
            </div>

            <div className="border border-stone-200 dark:border-stone-800 rounded-xl p-5 bg-stone-50 dark:bg-[#111]">
               <h4 className="font-mono text-xs font-bold tracking-widest text-slate-500 uppercase mb-4 border-b border-stone-200 dark:border-stone-800 pb-2">
                 Latest Releases
               </h4>
               <div className="flex flex-col gap-4 mt-4">
                 <div>
                   <div className="text-xs font-bold text-emerald-600 mb-1">v2.4.0 (Latest)</div>
                   <div className="text-sm text-slate-700 dark:text-slate-300 font-medium">Performance improvements and bug fixes</div>
                 </div>
                 <div>
                   <div className="text-xs font-bold text-slate-500 mb-1">v2.3.5</div>
                   <div className="text-sm text-slate-700 dark:text-slate-300 font-medium">Security patch for core module</div>
                 </div>
               </div>
            </div>

            <div>
               <a 
                 href={`https://github.com/${repo.owner}/${repo.name}`}
                 target="_blank"
                 rel="noreferrer"
                 className="block w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-center font-bold rounded-xl hover:bg-emerald-600 dark:hover:bg-emerald-500 transition-colors"
               >
                 View on GitHub
               </a>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
