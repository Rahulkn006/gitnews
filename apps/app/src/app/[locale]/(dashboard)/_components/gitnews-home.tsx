"use client";

import { api } from "@v1/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import {
  ArrowUpRight,
  Clock3,
  FolderGit2,
  Search,
  Sparkles,
  Star,
} from "lucide-react";
import { useMemo, useState } from "react";

function formatUpdated(value?: number) {
  if (!value) return "Recently updated";
  const diff = Date.now() - value;
  const minutes = Math.max(1, Math.floor(diff / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function RepoCard({ repo }: { repo: Record<string, unknown> }) {
  const data = repo as {
    _id: string;
    name: string;
    owner: string;
    description?: string | null;
    stars: number;
    language?: string | null;
    category?: string | null;
    updatedAt: number;
    repoUrl: string;
  };

  return (
    <a
      href={data.repoUrl}
      target="_blank"
      rel="noreferrer"
      className="group flex h-full flex-col rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-primary">{data.name}</p>
          <p className="truncate text-sm text-primary/60">{data.owner}</p>
        </div>
        <span className="rounded-full border border-primary/10 bg-primary/5 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-primary/70">
          {data.category ?? "Tool"}
        </span>
      </div>

      <p className="mb-4 line-clamp-3 flex-1 text-sm text-primary/70">
        {data.description ?? "A fast-moving repository with strong momentum."}
      </p>

      <div className="mt-auto flex flex-wrap items-center gap-2 text-xs text-primary/60">
        <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1">
          <Star className="h-3.5 w-3.5" /> {data.stars}
        </span>
        {data.language ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1">
            <FolderGit2 className="h-3.5 w-3.5" /> {data.language}
          </span>
        ) : null}
        <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1">
          <Clock3 className="h-3.5 w-3.5" /> {formatUpdated(data.updatedAt)}
        </span>
      </div>
    </a>
  );
}

export function GitNewsHome() {
  const featured = useQuery(api.github.getFeaturedRepos);
  const trending = useQuery(api.github.getTrendingRepos);
  const latest = useQuery(api.github.getLatestRepos);
  const categories = useQuery(api.github.getCategories);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const repos = useMemo(() => {
    const merged = [...(featured ?? []), ...(trending ?? []), ...(latest ?? [])];
    const deduped = new Map<string, (typeof merged)[number]>();
    for (const repo of merged) {
      deduped.set(repo._id, repo);
    }
    return Array.from(deduped.values());
  }, [featured, trending, latest]);

  const filteredRepos = useMemo(() => {
    return repos.filter((repo) => {
      const haystack = `${repo.name} ${repo.owner} ${repo.description ?? ""} ${repo.language ?? ""} ${repo.category ?? ""}`.toLowerCase();
      const matchesSearch = haystack.includes(search.toLowerCase());
      const matchesCategory =
        activeCategory === "All" || repo.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [repos, search, activeCategory]);

  const categoryOptions = useMemo(() => {
    const names = new Set<string>();
    names.add("All");
    for (const category of categories ?? []) {
      names.add(category.name);
    }
    for (const repo of repos) {
      if (repo.category) names.add(repo.category);
    }
    return Array.from(names);
  }, [categories, repos]);

  const spotlight = featured?.[0] ?? trending?.[0] ?? latest?.[0];

  return (
    <div className="min-h-full bg-secondary px-4 py-8 text-primary sm:px-6 lg:px-8 dark:bg-black">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="overflow-hidden rounded-[28px] border border-border/70 bg-gradient-to-br from-primary/10 via-card to-card p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-background/80 px-3 py-1 text-sm text-primary/70">
                <Sparkles className="h-4 w-4" />
                StartupNiti-inspired AI repository news
              </div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Discover the tools and projects shaping the next wave of software.
              </h1>
              <p className="mt-3 max-w-xl text-sm text-primary/70 sm:text-base">
                A streamlined feed of trending GitHub repositories, curated by momentum, language, and category.
              </p>
            </div>

            <div className="rounded-2xl border border-primary/10 bg-background/70 p-4 backdrop-blur">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
                <Sparkles className="h-4 w-4" /> Featured now
              </div>
              {spotlight ? (
                <div>
                  <p className="text-lg font-semibold text-primary">{spotlight.name}</p>
                  <p className="mt-1 max-w-sm text-sm text-primary/60">
                    {spotlight.description ?? "A standout repository with broad developer interest."}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-primary/60">Syncing repositories…</p>
              )}
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4 rounded-[24px] border border-border/70 bg-card/70 p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/40" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search repositories, languages, or topics"
                className="w-full rounded-full border border-border bg-background px-10 py-2.5 text-sm text-primary outline-none ring-0 placeholder:text-primary/40"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((category) => (
                <button
                  type="button"
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full px-3 py-1.5 text-sm transition ${
                    activeCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-primary/70 hover:bg-primary/10"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-[24px] border border-border/70 bg-card/70 p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-primary">Trending now</h2>
                <p className="text-sm text-primary/60">Fresh picks with growing traction.</p>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary/70">
                {filteredRepos.length} results
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {filteredRepos.length ? (
                filteredRepos.slice(0, 8).map((repo) => (
                  <RepoCard key={repo._id} repo={repo} />
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-border/60 bg-background/40 p-6 text-sm text-primary/60 md:col-span-2">
                  No repositories match the current filters yet.
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[24px] border border-border/70 bg-card/70 p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-primary">Latest updates</h3>
                <ArrowUpRight className="h-4 w-4 text-primary/50" />
              </div>
              <div className="space-y-3">
                {(latest ?? []).slice(0, 4).map((repo) => (
                  <div key={repo._id} className="rounded-xl border border-border/60 bg-background/50 p-3">
                    <p className="font-medium text-primary">{repo.name}</p>
                    <p className="mt-1 text-sm text-primary/60">{repo.owner}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-border/70 bg-card/70 p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-primary">What to expect</h3>
                <Sparkles className="h-4 w-4 text-primary/50" />
              </div>
              <ul className="space-y-2 text-sm text-primary/70">
                <li>• Curated repository cards with star, language, and recency signals.</li>
                <li>• Search and category filters for quick discovery.</li>
                <li>• A modern feed designed for fast scanning and discovery.</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
