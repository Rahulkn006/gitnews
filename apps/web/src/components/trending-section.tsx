"use client";

import { mapConvexRepo } from "@/lib/data-mapper";
import { fetcher } from "@/lib/fetcher";
import useSWR from "swr";
import Link from "next/link";
import { RepoCard } from "./repo-card";

export function TrendingSection() {
  const { data: dbRepos } = useSWR("http://localhost:3001/api/repositories", fetcher);

  if (dbRepos === undefined) {
    return (
      <div className="py-16 flex justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  const trendingRepos = dbRepos.map(mapConvexRepo).slice(0, 3);

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 md:px-8 border-b border-border/60">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-[10px] font-mono text-primary uppercase tracking-widest block mb-1">
            Discover
          </span>
          <h2 className="text-xl md:text-2xl font-bold font-mono tracking-tight text-foreground">
            Trending Repositories
          </h2>
        </div>
        <Link
          href="/trending"
          className="text-xs font-mono text-muted-foreground hover:text-primary transition-colors"
        >
          View All Trending →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trendingRepos.map((repo: any) => (
          <RepoCard key={repo._id || repo.id} repo={repo} />
        ))}
      </div>
    </section>
  );
}
