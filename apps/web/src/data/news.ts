export interface NewsItem {
  id: string;
  headline: string;
  repository: string;
  category: "New Releases" | "Breaking Changes" | "Major Updates" | "Developer Tools" | "Security" | "AI Projects";
  date: string;
  impactScore: number;
  explanation: string;
  url: string;
}

export const mockNews: NewsItem[] = [
  {
    id: "news-1",
    headline: "React Repository Introduces New Compiler Update",
    repository: "facebook/react",
    category: "Major Updates",
    date: "2024-03-21T10:00:00Z",
    impactScore: 98,
    explanation: "The React team has merged the initial experimental version of the React Compiler, promising significant performance improvements without manual memoization.",
    url: "https://github.com/facebook/react"
  },
  {
    id: "news-2",
    headline: "Next.js 14.2 Release Candidate 1 Now Available",
    repository: "vercel/next.js",
    category: "New Releases",
    date: "2024-03-20T14:30:00Z",
    impactScore: 92,
    explanation: "Vercel released the first release candidate for Next.js 14.2, featuring improved Turbopack stability and caching updates.",
    url: "https://github.com/vercel/next.js"
  },
  {
    id: "news-3",
    headline: "Critical Security Patch in Popular NPM Package",
    repository: "advisories/github",
    category: "Security",
    date: "2024-03-21T08:15:00Z",
    impactScore: 100,
    explanation: "A high-severity vulnerability was patched in a popular networking library. Developers are urged to update immediately.",
    url: "https://github.com/advisories"
  },
  {
    id: "news-4",
    headline: "Open Source AI Agent Framework Gains 20K Stars",
    repository: "langchain-ai/langchain",
    category: "AI Projects",
    date: "2024-03-19T16:45:00Z",
    impactScore: 95,
    explanation: "LangChain continues its explosive growth as developers flock to build autonomous AI agents with the new v0.1 release.",
    url: "https://github.com/langchain-ai/langchain"
  },
  {
    id: "news-5",
    headline: "New Rust-based JavaScript Linter Unveiled",
    repository: "oxc-project/oxc",
    category: "Developer Tools",
    date: "2024-03-20T09:20:00Z",
    impactScore: 88,
    explanation: "Oxc, a new JavaScript toolchain written in Rust, claims to be 50x faster than ESLint in early benchmarks.",
    url: "https://github.com/oxc-project/oxc"
  },
  {
    id: "news-6",
    headline: "TypeScript 5.4 Drops with NoInfer Utility Type",
    repository: "microsoft/TypeScript",
    category: "New Releases",
    date: "2024-03-18T11:00:00Z",
    impactScore: 94,
    explanation: "TypeScript 5.4 is officially released, bringing the NoInfer utility type, improved type narrowing, and better performance.",
    url: "https://github.com/microsoft/TypeScript"
  },
  {
    id: "news-7",
    headline: "Breaking Changes in Node.js 22 Module Resolution",
    repository: "nodejs/node",
    category: "Breaking Changes",
    date: "2024-03-21T13:10:00Z",
    impactScore: 85,
    explanation: "Upcoming changes to module resolution in Node.js 22 may require package authors to update their export maps.",
    url: "https://github.com/nodejs/node"
  },
  {
    id: "news-8",
    headline: "Vite 5.2 Released with Faster Server Startup",
    repository: "vitejs/vite",
    category: "Developer Tools",
    date: "2024-03-19T10:00:00Z",
    impactScore: 90,
    explanation: "Vite 5.2 brings significant performance improvements to the development server startup time and HMR.",
    url: "https://github.com/vitejs/vite"
  },
  {
    id: "news-9",
    headline: "New Open Source LLM Rivals GPT-4 Performance",
    repository: "mistralai/mistral-src",
    category: "AI Projects",
    date: "2024-03-20T15:30:00Z",
    impactScore: 97,
    explanation: "A new open-weights model has been released that achieves state-of-the-art performance on popular coding benchmarks.",
    url: "https://github.com/mistralai/mistral-src"
  },
  {
    id: "news-10",
    headline: "Deno Standard Library Reaches 1.0",
    repository: "denoland/deno_std",
    category: "Major Updates",
    date: "2024-03-18T14:20:00Z",
    impactScore: 82,
    explanation: "The Deno standard library has officially been stabilized and reached version 1.0 after years of development.",
    url: "https://github.com/denoland/deno_std"
  },
  // Generate 20 more mock news items
  ...Array.from({ length: 20 }).map((_, i) => ({
    id: `news-${i + 11}`,
    headline: `Exciting Update ${i + 1} Released for Popular Framework`,
    repository: `developer${i + 1}/project-${i + 1}`,
    category: ["New Releases", "Breaking Changes", "Major Updates", "Developer Tools", "Security", "AI Projects"][i % 6] as NewsItem["category"],
    date: new Date(1700000000000 - i * 86400000).toISOString(),
    impactScore: (i * 7) % 40 + 60,
    explanation: `This is a generated news summary for a recent event in the open source community regarding project ${i + 1}.`,
    url: `https://github.com/developer${i + 1}/project-${i + 1}`
  }))
];
