"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Front", href: "/" },
    { name: "Trending", href: "/trending" },
    { name: "AI Projects", href: "/ai" },
    { name: "Repositories", href: "/repos" },
    { name: "News", href: "/news" }
  ];

  return (
    <header className="sticky top-0 w-full z-50 border-b border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md">
      {/* Utility top bar */}
      <div className="bg-stone-50/80 dark:bg-[#111]/80 border-b border-stone-200 dark:border-stone-800 text-[10px] tracking-widest text-slate-500 dark:text-slate-400 py-2 px-4 md:px-8 font-black uppercase">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center justify-center px-2 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 rounded font-bold text-[9px]">LIVE</span>
            <span>DEVELOPER TECHNOLOGY INTELLIGENCE</span>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <span>NO LOGIN REQUIRED</span>
            <span>·</span>
            <span>FREE & OPEN</span>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8 md:gap-10">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-serif font-black text-2xl text-slate-900 dark:text-white flex items-center gap-2 tracking-tighter">
              <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-500 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 4h-2m2 0h-3m3 0V9m-3 3h3m-3 3h3m-3 3h3M9 17h1m-1-3h1m-1-3h1m-1-3h1" />
              </svg>
              GitNews.
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 ${isActive ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-slate-500 dark:text-slate-400"
                    }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/repos"
            className="text-xs font-bold font-sans px-4 py-2 rounded-md bg-stone-100 hover:bg-stone-200 dark:bg-stone-900 dark:hover:bg-stone-800 text-slate-700 dark:text-slate-300 border border-stone-200 dark:border-stone-800 transition-all"
          >
            ⌘K Search
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
