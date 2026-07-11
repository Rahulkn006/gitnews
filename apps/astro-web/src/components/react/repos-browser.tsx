import { withConvex } from "@/lib/convex";
import { api } from "@v1/backend/convex/_generated/api";
import { useAction, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { RepoCard } from "./repo-card";
import { SearchFilter } from "./search-filter";

export const ReposBrowser = withConvex(function ReposBrowser() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Trending");
  const [isFetchingJIT, setIsFetchingJIT] = useState(false);

  const dbRepos = useQuery(api.github.getAllRepos);
  const fetchTopicOnDemand = useAction(api.github.fetchTopicOnDemand);
  const repositories = dbRepos && dbRepos.length > 0 ? dbRepos : [];

  const filters = [
    "All",
    "AI",
    "Frontend",
    "Backend",
    "DevOps",
    "Database",
    "Security",
    "Mobile",
    "Developer Tools",
  ];

  const filteredRepos = repositories
    .map((repo: any) => {
      let relevance = 0;
      const query = searchQuery.toLowerCase().trim();

      const matchesCategory =
        selectedFilter === "All" ||
        (repo.categories && repo.categories.includes(selectedFilter)) ||
        repo.category === selectedFilter ||
        repo.primaryCategory === selectedFilter;

      if (!matchesCategory) return { repo, relevance: -1 };
      if (!query) return { repo, relevance: 1 };

      const name = (repo.name || "").toLowerCase();
      const owner = (repo.owner || "").toLowerCase();
      const desc = (repo.aiSummary || repo.description || "").toLowerCase();
      const language = (repo.language || "").toLowerCase();

      if (name === query) relevance += 100;
      else if (name.includes(query)) relevance += 50;

      if (owner === query) relevance += 80;
      else if (owner.includes(query)) relevance += 30;

      if (repo.topics?.some((t: string) => t.toLowerCase() === query))
        relevance += 80;
      else if (
        repo.topics?.some((t: string) => t.toLowerCase().includes(query))
      )
        relevance += 40;

      if (repo.categories?.some((c: string) => c.toLowerCase() === query))
        relevance += 60;

      if (language === query) relevance += 50;

      try {
        const wordRegex = new RegExp(`\\b${query}\\b`, "i");
        if (wordRegex.test(desc)) relevance += 10;
      } catch (e) {
        // Fallback for invalid regex (e.g. query has unescaped special chars)
        if (desc.includes(query)) relevance += 5;
      }

      return { repo, relevance };
    })
    .filter((item: any) => item.relevance > 0);

  const sortedRepos = [...filteredRepos].sort((a: any, b: any) => {
    // If there's an active search, prioritize relevance over the dropdown sort
    if (searchQuery.trim() && a.relevance !== b.relevance) {
      return b.relevance - a.relevance;
    }

    const rA = a.repo;
    const rB = b.repo;

    switch (sortBy) {
      case "Stars":
        return (rB.stars || 0) - (rA.stars || 0);
      case "Growth 24h":
        return (rB.growth24h || 0) - (rA.growth24h || 0);
      case "Growth 7d":
        return (rB.growth7d || 0) - (rA.growth7d || 0);
      case "Recently Updated":
        return (rB.updatedAt || 0) - (rA.updatedAt || 0);
      case "Trending":
      default:
        return (rB.trendingScore || 0) - (rA.trendingScore || 0);
    }
  });

  useEffect(() => {
    const query = searchQuery.trim();
    if (query.length < 2) return;

    const timeout = setTimeout(async () => {
      // If we don't have enough local results, let's ask GitHub in real-time!
      if (filteredRepos.length < 3) {
        try {
          setIsFetchingJIT(true);
          await fetchTopicOnDemand({ topic: query });
        } catch (e) {
          console.error("Failed JIT fetch:", e);
        } finally {
          setIsFetchingJIT(false);
        }
      }
    }, 1500);

    return () => clearTimeout(timeout);
  }, [searchQuery, filteredRepos.length]);

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block mb-1">
            DIRECTORY
          </span>
          <h1 className="text-2xl md:text-3xl font-bold font-mono tracking-tight mb-2">
            📦 Repository Browser
          </h1>
          <p className="text-muted-foreground text-xs font-mono">
            Browse and filter open-source packages and frameworks.
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="sort"
            className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest"
          >
            Sort By
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-sm font-mono px-3 py-1.5 rounded-md text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="Trending">🔥 Trending</option>
            <option value="Stars">⭐ Stars</option>
            <option value="Growth 24h">📈 Growth 24h</option>
            <option value="Growth 7d">🚀 Growth 7d</option>
            <option value="Recently Updated">🕒 Recently Updated</option>
          </select>
        </div>
      </div>

      <SearchFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        filters={filters}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dbRepos === undefined ? (
          <div className="col-span-full py-12 text-center text-xs font-mono text-muted-foreground animate-pulse">
            Loading intelligence...
          </div>
        ) : isFetchingJIT ? (
          <div className="col-span-full py-12 text-center text-xs font-mono text-emerald-500 animate-pulse">
            Fetching real-time from GitHub...
          </div>
        ) : sortedRepos.length > 0 ? (
          sortedRepos.map(({ repo }: any) => (
            <RepoCard key={repo._id || repo.id} repo={repo} />
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-xs font-mono text-muted-foreground">
            No matching repositories found.
          </div>
        )}
      </div>
    </main>
  );
});
