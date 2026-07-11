import React, { useState, useEffect } from "react";

interface ResearchSource {
  title: string;
  platform: string;
  summary: string;
  url: string;
}

interface DeepResearchData {
  overview: string;
  whyDevelopersWatch: string;
  communitySentiment: string;
  learningValue: string;
  productionUsage: string;
  recentActivity: string;
  usefulResources: string;
  sources: ResearchSource[];
  confidence: "High" | "Medium" | "Low";
  status: "available" | "unavailable";
}

export default function OllagraphDeepResearchClient({
  owner,
  repo,
}: { owner: string; repo: string }) {
  const [data, setData] = useState<DeepResearchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchResearch() {
      try {
        const { getApiUrl } = await import("@/lib/api");
        const response = await fetch(
          `${getApiUrl()}/api/repositories/${owner}/${repo}/analysis`,
        );
        if (!response.ok) throw new Error("Failed to fetch");
        const json = await response.json();
        
        const deepResearch = json.deepResearch;
        if (!deepResearch || deepResearch.status === "unavailable") {
          throw new Error("unavailable");
        }
        setData(deepResearch);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchResearch();
  }, [owner, repo]);

  return (
    <section className="flex flex-col gap-6 mb-12">
      <div className="flex items-center gap-3 mb-2 border-b-2 border-stone-900 dark:border-stone-100 pb-3">
        <span className="w-3 h-3 bg-purple-500 rounded-sm rotate-45 animate-pulse"></span>
        <h2 className="text-2xl font-serif font-black uppercase tracking-tight text-stone-900 dark:text-white">
          Ollagraph Deep Research
        </h2>
        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 text-[9px] font-mono font-bold uppercase tracking-widest rounded-md border border-purple-200 dark:border-purple-800 ml-2">
          Real-Time Analysis
        </span>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center p-12 bg-stone-50/80 dark:bg-[#111]/80 border border-stone-200 dark:border-stone-800 rounded-xl">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="font-mono text-sm text-stone-600 dark:text-stone-400">
            Crawling HackerNews, Reddit, and GitHub...
          </p>
        </div>
      )}

      {error && !loading && (
        <div className="flex flex-col items-center justify-center p-12 bg-red-50/80 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-xl">
          <p className="font-mono text-sm text-red-600 dark:text-red-400">
            Deep research unavailable currently
          </p>
        </div>
      )}

      {data && !loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ResearchCard title="Overview" content={data.overview} data={data} />
          <ResearchCard
            title="Why Developers Watch"
            content={data.whyDevelopersWatch}
            data={data}
          />
          <ResearchCard
            title="Community Sentiment"
            content={data.communitySentiment}
            data={data}
          />
          <ResearchCard
            title="Learning Value"
            content={data.learningValue}
            data={data}
          />
          <ResearchCard
            title="Production Usage"
            content={data.productionUsage}
            data={data}
          />
          <ResearchCard
            title="Recent Activity"
            content={data.recentActivity}
            data={data}
          />
          <ResearchCard
            title="Useful Resources"
            content={data.usefulResources}
            data={data}
          />
        </div>
      )}
    </section>
  );
}

function ResearchCard({
  title,
  content,
  data,
}: { title: string; content: string; data: DeepResearchData }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const shortSummary = content.substring(0, 150) + "...";

  return (
    <>
      <button
        onClick={() => setIsExpanded(true)}
        className="text-left bg-stone-50/80 dark:bg-[#111]/80 border border-stone-200 dark:border-stone-800 p-5 rounded-xl flex flex-col gap-2 group hover:border-purple-500/50 hover:shadow-md transition-all relative overflow-hidden h-full cursor-pointer"
      >
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-bl-full pointer-events-none"></div>
        <div className="flex justify-between items-center w-full">
          <h3 className="font-mono text-[10px] font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">
            {title}
          </h3>
          <span
            className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${data.confidence === "High" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : data.confidence === "Medium" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}
          >
            {data.confidence} CONFIDENCE
          </span>
        </div>
        <p className="font-sans text-stone-700 dark:text-stone-300 text-sm leading-relaxed mt-1 line-clamp-3 relative z-10">
          {shortSummary}
        </p>
        <div className="mt-auto pt-3 flex items-center text-xs font-mono font-bold text-stone-400 group-hover:text-purple-500 transition-colors">
          <span>View Detailed Report →</span>
        </div>
      </button>

      {isExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#0a0a0a] border border-stone-200 dark:border-stone-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center p-6 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 bg-purple-500 rounded-sm rotate-45"></span>
                <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-white uppercase tracking-tight">
                  Detailed AI Intelligence Report
                </h2>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-stone-400 hover:text-stone-900 dark:hover:text-white p-2"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex flex-col gap-8">
              <div className="flex flex-col gap-3">
                <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-stone-500">
                  Overview
                </h4>
                <div className="bg-stone-50 dark:bg-[#111] border border-stone-200 dark:border-stone-800 p-5 rounded-xl">
                  <p className="font-sans text-sm text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-wrap">
                    {data.overview}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-stone-500">
                  Why Developers Watch
                </h4>
                <div className="bg-stone-50 dark:bg-[#111] border border-stone-200 dark:border-stone-800 p-5 rounded-xl">
                  <p className="font-sans text-sm text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-wrap">
                    {data.whyDevelopersWatch}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-stone-500">
                  Community Sentiment
                </h4>
                <div className="bg-stone-50 dark:bg-[#111] border border-stone-200 dark:border-stone-800 p-5 rounded-xl">
                  <p className="font-sans text-sm text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-wrap">
                    {data.communitySentiment}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-3">
                  <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-stone-500">
                    Learning Value
                  </h4>
                  <div className="bg-stone-50 dark:bg-[#111] border border-stone-200 dark:border-stone-800 p-5 rounded-xl h-full">
                    <p className="font-sans text-sm text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-wrap">
                      {data.learningValue}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-stone-500">
                    Production Usage
                  </h4>
                  <div className="bg-stone-50 dark:bg-[#111] border border-stone-200 dark:border-stone-800 p-5 rounded-xl h-full">
                    <p className="font-sans text-sm text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-wrap">
                      {data.productionUsage}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-stone-500">
                  Adoption Signals & Real Evidence
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {data.sources.map((s, idx) => (
                    <a
                      key={idx}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg hover:border-purple-500 transition-colors"
                    >
                      <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wider mb-1">
                        {s.platform}
                      </span>
                      <span className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-2 line-clamp-1">
                        {s.title}
                      </span>
                      <span className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2">
                        {s.summary}
                      </span>
                    </a>
                  ))}
                  {data.sources.length === 0 && (
                    <div className="col-span-full p-4 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg text-sm text-stone-500">
                      No verified external sources found.
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-stone-500">
                  Useful Resources
                </h4>
                <div className="bg-stone-50 dark:bg-[#111] border border-stone-200 dark:border-stone-800 p-5 rounded-xl">
                  <p className="font-sans text-sm text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-wrap">
                    {data.usefulResources}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
