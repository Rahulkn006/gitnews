"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@v1/backend/convex/_generated/api";
import { RepoCard } from "@/components/repo-card";
import { SearchFilter } from "@/components/search-filter";
import { mockRepositories } from "@/data/repositories";

export default function ReposPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  const dbRepos = useQuery(api.github.getTrendingRepos);
  const repositories = dbRepos && dbRepos.length > 0 ? dbRepos : mockRepositories;

  const filters = ["All", "AI Agents", "LLM Tools", "Machine Learning", "Developer Tools"];

  const filteredRepos = repositories.filter((repo: any) => {
    const descriptionText = repo.aiSummary || repo.description || "";
    const matchesSearch =
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      descriptionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (repo.owner && repo.owner.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedFilter === "All" || repo.category === selectedFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <div className="mb-10">
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

      <SearchFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        filters={filters}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRepos.length > 0 ? (
          filteredRepos.map((repo: any) => <RepoCard key={repo._id || repo.id} repo={repo} />)
        ) : (
          <div className="col-span-full py-12 text-center text-xs font-mono text-muted-foreground">
            No matching repositories found.
          </div>
        )}
      </div>
    </main>
  );
}
