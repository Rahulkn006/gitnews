"use client";

import Link from "next/link";

export function GitNewsFooter() {
  return (
    <footer className="bg-stone-50 dark:bg-[#0a0a0a] border-t border-stone-200 dark:border-stone-800 mt-20 py-16 text-sm font-sans text-slate-500 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="md:col-span-2 flex flex-col gap-4">
          <span className="font-serif font-black text-2xl text-slate-900 dark:text-white tracking-tighter block">
            GitNews.
          </span>
          <p className="text-slate-500 dark:text-slate-400 font-sans max-w-sm leading-relaxed text-sm">
            An open-source technology intelligence directory tracking the bleeding edge of developer ecosystems, GitHub repositories, and AI agent frameworks.
          </p>
        </div>
        <div>
          <h4 className="text-slate-900 dark:text-white font-black uppercase tracking-widest text-xs mb-6">Sections</h4>
          <ul className="flex flex-col gap-4">
            <li><Link href="/trending" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium">Trending</Link></li>
            <li><Link href="/ai" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium">AI Projects</Link></li>
            <li><Link href="/repos" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium">Repositories</Link></li>
            <li><Link href="/news" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium">News Feed</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-slate-900 dark:text-white font-black uppercase tracking-widest text-xs mb-6">System</h4>
          <ul className="flex flex-col gap-4">
            <li><a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium">GitHub API</a></li>
            <li><a href="https://convex.dev" target="_blank" rel="noreferrer" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium">Convex DB</a></li>
            <li><span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Active</span></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium tracking-wide">
        <span>© {new Date().getFullYear()} GITNEWS · ALL RIGHTS RESERVED</span>
        <span className="text-slate-400 dark:text-slate-500">POWERED BY INTELLIGENT DISCOVERY & CONVEX</span>
      </div>
    </footer>
  );
}
