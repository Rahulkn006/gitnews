import React, { useState, useEffect } from "react";
import { fetcher } from "@/lib/api";

interface SimilarRepo {
  owner: string;
  name: string;
  description: string;
  stars: number;
  language: string;
  matchReason: string;
}

export default function SimilarReposSidebar({
  owner,
  repo,
}: { owner: string; repo: string }) {
  const [repos, setRepos] = useState<SimilarRepo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSimilar() {
      try {
        const data = await fetcher(`/api/repositories/${owner}/${repo}/similar`);
        setRepos(data);
      } catch (err) {
        console.error("Failed to fetch similar repos", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSimilar();
  }, [owner, repo]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-white uppercase">
          Similar Repositories
        </h3>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="animate-pulse bg-stone-100 dark:bg-stone-900 h-32 rounded-xl border border-stone-200 dark:border-stone-800"
          ></div>
        ))}
      </div>
    );
  }

  if (repos.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 uppercase tracking-tight">
        Similar Repositories
      </h3>
      <div className="flex flex-col gap-4">
        {repos.map((r, i) => (
          <a
            key={i}
            href={`/repositories/${r.owner}/${r.name}`}
            className="block group bg-white dark:bg-[#111] border border-stone-200 dark:border-stone-800 p-4 rounded-xl hover:border-emerald-500/50 transition-all shadow-sm"
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400 group-hover:underline">
                {r.name}
              </h4>
              <div className="flex items-center gap-1 text-xs font-mono text-stone-500">
                <span className="text-amber-500">⭐</span>
                {r.stars >= 1000 ? `${(r.stars / 1000).toFixed(1)}k` : r.stars}
              </div>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 mb-3">
              {r.description || "No description available."}
            </p>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300">
                  {r.language || "Unknown"}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-500">
                  GitNews Score:{" "}
                  {Math.min(
                    Math.floor(
                      Math.min((r.stars / 50000) * 40, 40) +
                        15 +
                        Math.min(
                          ((Math.floor(r.stars * 0.005) + 12) / 100) * 15,
                          15,
                        ),
                    ),
                    99,
                  )}
                </span>
              </div>
              <div className="text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 p-1.5 rounded-md font-mono flex items-center gap-1">
                <span>🤖</span> AI Match: "{r.matchReason}"
              </div>
            </div>

            <div className="mt-3 text-right">
              <span className="text-xs font-mono font-bold text-stone-500 group-hover:text-emerald-500 transition-colors">
                Analyze →
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
