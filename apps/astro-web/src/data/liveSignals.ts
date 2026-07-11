export interface LiveSignal {
  id: string;
  repository: string;
  ownerAvatar: string;
  mentionsToday: number;
  sources: string[];
  trendingScore: number;
  sentiment: "positive" | "neutral" | "mixed";
  explanation: string;
  timestamp: string;
  eventType: string;
  importance: "High" | "Medium" | "Low";
}

export const mockLiveSignals: LiveSignal[] = [
  {
    id: "sig-1",
    repository: "langchain-ai/langchain",
    ownerAvatar: "https://github.com/langchain-ai.png",
    mentionsToday: 250,
    sources: ["GitHub", "Reddit", "Hacker News", "Product Hunt"],
    trendingScore: 98,
    sentiment: "positive",
    explanation:
      "This project is gaining attention because of new agent features, rapid commits and community discussions.",
    timestamp: "2024-03-21T14:30:00Z",
    eventType: "Trending",
    importance: "Medium",
  },
  {
    id: "sig-2",
    repository: "facebook/react",
    ownerAvatar: "https://github.com/facebook.png",
    mentionsToday: 185,
    sources: ["GitHub", "Twitter", "Hacker News"],
    trendingScore: 95,
    sentiment: "positive",
    explanation:
      "Trending due to the recent React Compiler announcement and upcoming v19 features.",
    timestamp: "2024-03-21T14:15:00Z",
    eventType: "Trending",
    importance: "Medium",
  },
  {
    id: "sig-3",
    repository: "vercel/next.js",
    ownerAvatar: "https://github.com/vercel.png",
    mentionsToday: 120,
    sources: ["GitHub", "Reddit", "Twitter"],
    trendingScore: 88,
    sentiment: "mixed",
    explanation:
      "Active discussions around caching behavior and the newly released Turbopack updates.",
    timestamp: "2024-03-21T13:45:00Z",
    eventType: "Trending",
    importance: "Medium",
  },
  {
    id: "sig-4",
    repository: "oxc-project/oxc",
    ownerAvatar: "https://github.com/oxc-project.png",
    mentionsToday: 310,
    sources: ["Hacker News", "GitHub", "Twitter"],
    trendingScore: 100,
    sentiment: "positive",
    explanation:
      "Viral adoption driven by developers replacing ESLint and Prettier for faster Rust-based tooling.",
    timestamp: "2024-03-21T14:28:00Z",
    eventType: "Trending",
    importance: "Medium",
  },
  {
    id: "sig-5",
    repository: "ollama/ollama",
    ownerAvatar: "https://github.com/ollama.png",
    mentionsToday: 215,
    sources: ["GitHub", "Reddit", "Product Hunt"],
    trendingScore: 92,
    sentiment: "positive",
    explanation:
      "Surging in popularity as developers seek easy ways to run large language models locally.",
    timestamp: "2024-03-21T14:05:00Z",
    eventType: "Trending",
    importance: "Medium",
  },
  {
    id: "sig-6",
    repository: "biomejs/biome",
    ownerAvatar: "https://github.com/biomejs.png",
    mentionsToday: 95,
    sources: ["GitHub", "Twitter"],
    trendingScore: 85,
    sentiment: "positive",
    explanation:
      "Steady growth as an all-in-one formatter and linter alternative in the web ecosystem.",
    timestamp: "2024-03-21T13:20:00Z",
    eventType: "Trending",
    importance: "Medium",
  },
  {
    id: "sig-7",
    repository: "redis/redis",
    ownerAvatar: "https://github.com/redis.png",
    mentionsToday: 450,
    sources: ["Hacker News", "Reddit", "Twitter", "GitHub"],
    trendingScore: 99,
    sentiment: "mixed",
    explanation:
      "Spike in mentions following recent licensing changes and forks being created by the community.",
    timestamp: "2024-03-21T14:25:00Z",
    eventType: "Trending",
    importance: "Medium",
  },
  {
    id: "sig-8",
    repository: "valkey-io/valkey",
    ownerAvatar: "https://github.com/valkey-io.png",
    mentionsToday: 380,
    sources: ["GitHub", "Hacker News", "Reddit"],
    trendingScore: 96,
    sentiment: "positive",
    explanation:
      "Rapidly trending as an open-source alternative gaining traction from major tech companies.",
    timestamp: "2024-03-21T14:10:00Z",
    eventType: "Trending",
    importance: "Medium",
  },
  {
    id: "sig-9",
    repository: "excalidraw/excalidraw",
    ownerAvatar: "https://github.com/excalidraw.png",
    mentionsToday: 65,
    sources: ["GitHub", "Product Hunt"],
    trendingScore: 78,
    sentiment: "positive",
    explanation:
      "Consistently popular tool seeing an uptick due to a new major feature release.",
    timestamp: "2024-03-21T12:55:00Z",
    eventType: "Trending",
    importance: "Medium",
  },
  {
    id: "sig-10",
    repository: "huggingface/transformers",
    ownerAvatar: "https://github.com/huggingface.png",
    mentionsToday: 175,
    sources: ["GitHub", "Twitter", "Reddit"],
    trendingScore: 90,
    sentiment: "positive",
    explanation:
      "Trending in the AI community alongside the release of several new open-weights models.",
    timestamp: "2024-03-21T13:50:00Z",
    eventType: "Trending",
    importance: "Medium",
  },
  // Generate 20 more mock signals
  ...Array.from({ length: 20 }).map((_, i) => ({
    id: `sig-${i + 11}`,
    repository: `trending-org/project-${i + 1}`,
    ownerAvatar: `https://github.com/github.png`,
    mentionsToday: ((i * 47) % 300) + 20,
    sources: ["GitHub", "Reddit", "Hacker News", "Product Hunt"].slice(
      0,
      (i % 3) + 1,
    ),
    trendingScore: ((i * 13) % 40) + 60,
    sentiment: ["positive", "neutral", "mixed"][i % 3] as any,
    explanation: `This is an automatically generated pulse event for repository ${i + 11} capturing sudden developer interest.`,
    timestamp: new Date(1700000000000 - i * 3600000).toISOString(),
    eventType: "Trending",
    importance: "Medium" as const,
  })),
];
