
import { mapConvexRepo } from "@/lib/data-mapper";
import { fetcher } from "@/lib/api";
import {
  Brain,
  ChartLineUp,
  CheckCircle,
  Code,
  Eye,
  Fire,
  Lightbulb,
  Lightning,
  MicrophoneStage,
  Robot,
  Star,
  TrendUp,
} from "@phosphor-icons/react";
import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { RepoCard } from "./repo-card";

import { BackNavigation } from "./back-navigation";

// Mock Fallback Data
const MOCK_AI_REPOS = [
  {
    id: "mock1",
    name: "langchain",
    owner: "langchain-ai",
    description: "Building applications with LLMs through composability",
    language: "Python",
    stars: 89124,
    forks: 14500,
    category: "AI",
    url: "https://github.com/langchain-ai/langchain",
  },
  {
    id: "mock2",
    name: "auto-gpt",
    owner: "Significant-Gravitas",
    description:
      "An experimental open-source attempt to make GPT-4 fully autonomous.",
    language: "Python",
    stars: 165000,
    forks: 43000,
    category: "AI",
    url: "https://github.com/Significant-Gravitas/AutoGPT",
  },
  {
    id: "mock3",
    name: "transformers",
    owner: "huggingface",
    description:
      "State-of-the-art Machine Learning for Pytorch, TensorFlow, and JAX.",
    language: "Python",
    stars: 125000,
    forks: 24000,
    category: "AI",
    url: "https://github.com/huggingface/transformers",
  },
  {
    id: "mock4",
    name: "ollama",
    owner: "ollama",
    description:
      "Get up and running with Llama 3, Mistral, Gemma, and other large language models.",
    language: "Go",
    stars: 87000,
    forks: 7000,
    category: "AI",
    url: "https://github.com/ollama/ollama",
  },
];

const AI_CATEGORIES = [
  {
    id: 1,
    name: "AI Agents",
    icon: Robot,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    id: 2,
    name: "LLM Apps",
    icon: Brain,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    id: 3,
    name: "Computer Vision",
    icon: Eye,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    id: 4,
    name: "Voice AI",
    icon: MicrophoneStage,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    id: 5,
    name: "Automation",
    icon: Lightning,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  {
    id: 6,
    name: "Data AI",
    icon: ChartLineUp,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
  },
];

const PROJECT_IDEAS = [
  {
    id: "idea1",
    name: "Local Markdown Chatbot",
    level: "Beginner",
    stack: ["Python", "Ollama", "Streamlit"],
    similar: ["ollama/ollama-python", "streamlit/streamlit"],
    difficulty: "Low",
    value: "Learn LLM API basics and local inference.",
  },
  {
    id: "idea2",
    name: "RAG Document Assistant",
    level: "Intermediate",
    stack: ["TypeScript", "LangChain", "Pinecone"],
    similar: ["langchain-ai/langchainjs"],
    difficulty: "Medium",
    value: "Master Vector Databases and RAG pipelines.",
  },
  {
    id: "idea3",
    name: "Multi-Agent Researcher",
    level: "Advanced",
    stack: ["Python", "AutoGen", "OpenAI"],
    similar: ["microsoft/autogen", "Significant-Gravitas/AutoGPT"],
    difficulty: "High",
    value: "Understand multi-agent coordination & tool use.",
  },
];

const DEV_RECOMMENDATIONS = [
  {
    id: "rec1",
    title: "Worth building?",
    value: "Yes - High Demand",
    icon: CheckCircle,
    color: "text-emerald-500",
  },
  {
    id: "rec2",
    title: "Market demand",
    value: "Extreme Growth",
    icon: TrendUp,
    color: "text-purple-500",
  },
  {
    id: "rec3",
    title: "Learning score",
    value: "95 / 100",
    icon: Star,
    color: "text-amber-500",
  },
  {
    id: "rec4",
    title: "Future scope",
    value: "Agentic Workflows",
    icon: Fire,
    color: "text-rose-500",
  },
];

export function AIFeed() {
  const { data: dbRepos } = useSWR(
    "/api/repositories?category=AI",
    fetcher,
  );
  const [isTimeout, setIsTimeout] = useState(false);

  useEffect(() => {
    // If Convex doesn't return anything within 1.5s, we trigger fallback
    const timer = setTimeout(() => {
      setIsTimeout(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const isLoading = dbRepos === undefined && !isTimeout;
  const reposData =
    dbRepos && dbRepos.length > 0 ? dbRepos.map(mapConvexRepo) : MOCK_AI_REPOS;

  if (isLoading) {
    return (
      <div className="w-full h-32 flex flex-col items-center justify-center bg-stone-50 text-slate-900 dark:bg-[#0a0a0a] dark:text-slate-200 mt-12">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mb-3" />
        <p className="text-xs font-mono uppercase tracking-widest text-slate-500">
          Connecting Intelligence...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-stone-50 text-slate-900 dark:bg-[#0a0a0a] dark:text-slate-200 font-sans pb-16 selection:bg-emerald-500 selection:text-white">
      {/* Hero Section */}
      <div className="w-full border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-[#050505] py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <BackNavigation />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black tracking-tight text-slate-900 dark:text-white mb-4 flex items-center gap-4">
            AI PROJECT INTELLIGENCE
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 font-serif max-w-2xl">
            Discover trending AI repositories, tools and ideas
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-8 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Projects & Categories */}
        <div className="lg:col-span-8 flex flex-col gap-16">
          {/* AI Categories Section */}
          <section>
            <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-purple-500 rounded-sm" />
              AI CATEGORIES
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {AI_CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center gap-3 p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#0c0c0c] hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/5 transition-all cursor-pointer group"
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${cat.bg} ${cat.color} group-hover:scale-110 transition-transform`}
                  >
                    <cat.icon weight="duotone" className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {cat.name}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Trending AI Projects Section */}
          <section>
            <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm" />
              TRENDING AI PROJECTS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reposData.slice(0, 6).map((repo: any) => (
                <RepoCard key={repo.id} repo={repo} size="medium" />
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Ideas & Recommendations */}
        <aside className="lg:col-span-4 flex flex-col gap-12">
          {/* AI Developer Recommendations */}
          <section className="p-6 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#0c0c0c]">
            <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-stone-100 dark:border-stone-800/50 pb-4">
              <Lightbulb weight="fill" className="w-4 h-4 text-amber-500" />
              OLLAGRAPH INTELLIGENCE
            </h2>
            <div className="flex flex-col gap-4">
              {DEV_RECOMMENDATIONS.map((rec) => (
                <div key={rec.id} className="flex items-center justify-between">
                  <span className="text-stone-500 dark:text-stone-400 font-medium">
                    {rec.title}
                  </span>
                  <div
                    className={`flex items-center gap-1.5 font-bold ${rec.color}`}
                  >
                    <rec.icon weight="bold" className="w-4 h-4" />
                    {rec.value}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Project Ideas */}
          <section>
            <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-blue-500 rounded-sm" />
              PROJECT IDEAS
            </h2>
            <div className="flex flex-col gap-4">
              {PROJECT_IDEAS.map((idea) => (
                <div
                  key={idea.id}
                  className="p-5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#0c0c0c] hover:border-blue-500/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                      {idea.name}
                    </h3>
                    <span
                      className={`text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
                        idea.level === "Beginner"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : idea.level === "Intermediate"
                            ? "bg-amber-500/10 text-amber-500"
                            : "bg-rose-500/10 text-rose-500"
                      }`}
                    >
                      {idea.level}
                    </span>
                  </div>

                  <p className="text-stone-500 dark:text-stone-400 text-sm mb-4 line-clamp-2">
                    {idea.value}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {idea.stack.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs font-medium text-slate-700 dark:text-slate-300 bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded-md"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="text-xs text-stone-500 border-t border-stone-100 dark:border-stone-800/50 pt-3 flex items-center gap-2">
                    <Code weight="bold" className="w-3.5 h-3.5" />
                    Similar: {idea.similar.join(", ")}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </main>
    </div>
  );
}
