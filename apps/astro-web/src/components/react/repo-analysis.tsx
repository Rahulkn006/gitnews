
import { fetcher } from "@/lib/fetcher";
import useSWR from "swr";

export function RepoAnalysis({
  owner,
  name,
}: { owner: string; name: string }) {
  const { data: repo } = useSWR(
    `http://localhost:3001/api/repositories/${owner}/${name}`,
    fetcher,
  );

  if (repo === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-[#0a0a0a]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
          <p className="text-slate-500 font-mono text-sm tracking-widest uppercase">
            Analyzing Intelligence...
          </p>
        </div>
      </div>
    );
  }

  if (repo === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-[#0a0a0a]">
        <p className="text-slate-500 font-mono text-sm">
          Repository not found in intelligence database.
        </p>
      </div>
    );
  }

  // Extract real analysis if available, or fallback to mock logic
  const developerTarget =
    repo.developerAnalysis?.targetAudience ||
    (repo.topics?.includes("learning") ||
    repo.topics?.includes("tutorial") ||
    (repo.stars || 0) < 1000
      ? "Beginner friendly. Good for learning and small projects."
      : repo.topics?.includes("enterprise") ||
          (repo.stars || 0) > 10000 ||
          repo.language === "Java" ||
          repo.language === "C#"
        ? "Enterprise ready. Suitable for large scale production deployments."
        : "Startups and mid-sized teams. Great balance of agility and stability.");

  const ecosystemFit =
    repo.developerAnalysis?.ecosystemFit ||
    `Integrates well into modern ${repo.language || "development"} workflows. Particularly useful for teams building ${repo.topics?.[0] || "scalable"} applications.`;

  const verdict = repo.verdict || {
    learningValue: "Excellent",
    futurePotential: "High",
    communityStrength: "Very Active",
    summary:
      "A highly recommended repository to explore. Its architectural choices provide great educational value, and the active community ensures long-term viability.",
  };

  // Timeline (Safe fallbacks)
  const createdAt = repo.createdAt
    ? new Date(repo.createdAt).toLocaleDateString()
    : "Unknown Date";
  const updatedAt = repo.updatedAt
    ? new Date(repo.updatedAt).toLocaleDateString()
    : "Recently";

  // Alternatives (Mock logic based on category/language)
  const alternatives =
    repo.language === "TypeScript"
      ? ["vercel/next.js", "remix-run/remix", "facebook/react"]
      : repo.language === "Python"
        ? ["django/django", "tiangolo/fastapi", "pallets/flask"]
        : repo.language === "Rust"
          ? ["tokio-rs/tokio", "actix/actix-web", "serde-rs/serde"]
          : ["facebook/react", "vuejs/vue", "angular/angular"];

  return (
    <div className="w-full min-h-screen bg-stone-50 text-slate-900 dark:bg-[#0a0a0a] dark:text-slate-200 font-sans px-4 md:px-8 py-8 md:py-16 selection:bg-emerald-500 selection:text-white">
      <main className="max-w-4xl mx-auto flex flex-col gap-12">
        {/* 1. Repository Overview */}
        <section className="bg-white dark:bg-[#111] p-8 md:p-10 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                {repo.avatar && (
                  <img
                    src={repo.avatar}
                    alt={repo.owner}
                    className="w-16 h-16 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm"
                  />
                )}
                <div>
                  <h1 className="text-4xl md:text-5xl font-serif font-black tracking-tight text-slate-900 dark:text-white">
                    {repo.name}
                  </h1>
                  <p className="text-lg text-slate-500 font-mono mt-1">
                    by {repo.owner}
                  </p>
                </div>
              </div>
              <p className="text-xl text-slate-700 dark:text-slate-300 max-w-2xl mt-2 leading-relaxed">
                {repo.description || "No description provided."}
              </p>
              <div className="flex flex-wrap gap-3 mt-4">
                {repo.topics?.map((topic) => (
                  <span
                    key={topic}
                    className="px-3 py-1 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-slate-600 dark:text-slate-400 text-xs font-medium rounded-full"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-row md:flex-col gap-4 md:gap-6 bg-stone-50 dark:bg-[#0a0a0a] p-5 rounded-xl border border-stone-100 dark:border-stone-800 md:min-w-[180px]">
              <div>
                <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                  Stars
                </span>
                <span className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-yellow-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  {(repo.stars || 0).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                  Language
                </span>
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {repo.language || "Mixed"}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Why Trending? */}
        <section className="bg-white dark:bg-[#111] p-8 md:p-10 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-pulse"></span>
            <h2 className="text-2xl font-serif font-black uppercase tracking-tight text-slate-900 dark:text-white">
              Why Trending?
            </h2>
          </div>
          <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 leading-relaxed bg-orange-50 dark:bg-orange-500/5 p-6 rounded-xl border border-orange-100 dark:border-orange-500/10 border-l-4 border-l-orange-500">
            {repo.aiSummary ||
              "This repository is gaining significant traction due to an influx of recent stars and community activity, making it a highly viewed project this week."}
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 3. Developer Analysis */}
          <section className="bg-white dark:bg-[#111] p-8 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
            <h2 className="text-xl font-serif font-black uppercase tracking-tight text-slate-900 dark:text-white mb-6 border-b border-stone-100 dark:border-stone-800 pb-4">
              Developer Analysis
            </h2>
            <div className="flex flex-col gap-6">
              <div>
                <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                  Target Audience
                </span>
                <p className="text-base text-slate-700 dark:text-slate-300 bg-stone-50 dark:bg-[#0a0a0a] p-4 rounded-lg border border-stone-100 dark:border-stone-800">
                  {developerTarget}
                </p>
              </div>
              <div>
                <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                  Ecosystem Fit
                </span>
                <p className="text-base text-slate-700 dark:text-slate-300">
                  Integrates well into modern {repo.language || "development"}{" "}
                  workflows. Particularly useful for teams building{" "}
                  {repo.topics?.[0] || "scalable"} applications.
                </p>
              </div>
            </div>
          </section>

          {/* 4. Timeline */}
          <section className="bg-white dark:bg-[#111] p-8 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
            <h2 className="text-xl font-serif font-black uppercase tracking-tight text-slate-900 dark:text-white mb-6 border-b border-stone-100 dark:border-stone-800 pb-4">
              Timeline
            </h2>
            <div className="relative pl-6 border-l-2 border-stone-100 dark:border-stone-800 flex flex-col gap-6">
              <div className="relative">
                <span className="absolute -left-[31px] top-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-[#111]"></span>
                <span className="block text-[10px] font-mono text-emerald-600 dark:text-emerald-400 mb-1">
                  {updatedAt}
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  Recent Activity Spike
                </span>
                <p className="text-xs text-slate-500 mt-1">
                  High volume of commits and issues closed.
                </p>
              </div>
              <div className="relative">
                <span className="absolute -left-[31px] top-1 w-3 h-3 bg-stone-300 dark:bg-stone-600 rounded-full border-2 border-white dark:border-[#111]"></span>
                <span className="block text-[10px] font-mono text-slate-500 mb-1">
                  ~1 Month Ago
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  Major Milestone
                </span>
                <p className="text-xs text-slate-500 mt-1">
                  Reached {Math.floor((repo.stars || 0) * 0.9).toLocaleString()}{" "}
                  stars.
                </p>
              </div>
              <div className="relative">
                <span className="absolute -left-[31px] top-1 w-3 h-3 bg-stone-300 dark:bg-stone-600 rounded-full border-2 border-white dark:border-[#111]"></span>
                <span className="block text-[10px] font-mono text-slate-500 mb-1">
                  {createdAt}
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  Project Inception
                </span>
                <p className="text-xs text-slate-500 mt-1">
                  Initial commit and open sourcing.
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 5. Alternatives */}
          <section className="bg-white dark:bg-[#111] p-8 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
            <h2 className="text-xl font-serif font-black uppercase tracking-tight text-slate-900 dark:text-white mb-6 border-b border-stone-100 dark:border-stone-800 pb-4">
              Alternatives
            </h2>
            <div className="flex flex-col gap-3">
              {alternatives.map((alt) => (
                <a
                  key={alt}
                  href={`https://github.com/${alt}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-4 rounded-xl border border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-[#0a0a0a] hover:border-emerald-500/50 transition-colors group"
                >
                  <span className="font-mono text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {alt}
                  </span>
                  <svg
                    className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              ))}
            </div>
          </section>

          {/* 6. GitNews Verdict */}
          <section className="bg-emerald-950 p-8 rounded-2xl border border-emerald-900 shadow-sm text-emerald-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <h2 className="text-xl font-serif font-black uppercase tracking-tight text-white mb-6 border-b border-emerald-800/50 pb-4 relative z-10 flex items-center gap-3">
              <span className="w-2 h-2 bg-emerald-400 rounded-sm"></span>
              GitNews Verdict
            </h2>
            <div className="flex flex-col gap-5 relative z-10">
              <div className="flex justify-between items-center border-b border-emerald-800/30 pb-3">
                <span className="text-sm font-medium text-emerald-200">
                  Learning Value
                </span>
                <span className="text-sm font-bold text-white bg-emerald-900 px-2 py-1 rounded">
                  {verdict.learningValue}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-emerald-800/30 pb-3">
                <span className="text-sm font-medium text-emerald-200">
                  Future Potential
                </span>
                <span className="text-sm font-bold text-white bg-emerald-900 px-2 py-1 rounded">
                  {verdict.futurePotential}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-emerald-200">
                  Community Strength
                </span>
                <span className="text-sm font-bold text-white bg-emerald-900 px-2 py-1 rounded">
                  {verdict.communityStrength}
                </span>
              </div>
              <p className="text-sm text-emerald-100/80 mt-2 leading-relaxed bg-emerald-900/40 p-4 rounded-lg">
                {verdict.summary}
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
