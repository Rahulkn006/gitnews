export interface Repository {
  id: string;
  rank: number;
  name: string;
  owner: string;
  ownerAvatar: string;
  description: string;
  stars: number;
  forks: number;
  watchers: number;
  language: string;
  topics: string[];
  lastUpdated: string;
  weeklyGrowth: number;
  url: string;
}

export const mockRepositories: Repository[] = [
  {
    id: "repo-1",
    rank: 1,
    name: "react",
    owner: "facebook",
    ownerAvatar: "https://github.com/facebook.png",
    description: "The library for web and native user interfaces.",
    stars: 218000,
    forks: 46000,
    watchers: 6700,
    language: "JavaScript",
    topics: ["react", "frontend", "declarative", "ui", "library"],
    lastUpdated: "2024-03-20T10:00:00Z",
    weeklyGrowth: 1500,
    url: "https://github.com/facebook/react"
  },
  {
    id: "repo-2",
    rank: 2,
    name: "next.js",
    owner: "vercel",
    ownerAvatar: "https://github.com/vercel.png",
    description: "The React Framework for the Web.",
    stars: 118000,
    forks: 25000,
    watchers: 1500,
    language: "TypeScript",
    topics: ["nextjs", "react", "framework", "ssr", "ssg"],
    lastUpdated: "2024-03-21T12:30:00Z",
    weeklyGrowth: 2100,
    url: "https://github.com/vercel/next.js"
  },
  {
    id: "repo-3",
    rank: 3,
    name: "vscode",
    owner: "microsoft",
    ownerAvatar: "https://github.com/microsoft.png",
    description: "Visual Studio Code",
    stars: 155000,
    forks: 29000,
    watchers: 3200,
    language: "TypeScript",
    topics: ["editor", "electron", "typescript", "vscode"],
    lastUpdated: "2024-03-21T09:15:00Z",
    weeklyGrowth: 800,
    url: "https://github.com/microsoft/vscode"
  },
  {
    id: "repo-4",
    rank: 4,
    name: "linux",
    owner: "torvalds",
    ownerAvatar: "https://github.com/torvalds.png",
    description: "Linux kernel source tree",
    stars: 167000,
    forks: 55000,
    watchers: 8500,
    language: "C",
    topics: ["kernel", "linux", "c", "os"],
    lastUpdated: "2024-03-21T14:20:00Z",
    weeklyGrowth: 600,
    url: "https://github.com/torvalds/linux"
  },
  {
    id: "repo-5",
    rank: 5,
    name: "tensorflow",
    owner: "tensorflow",
    ownerAvatar: "https://github.com/tensorflow.png",
    description: "An Open Source Machine Learning Framework for Everyone",
    stars: 180000,
    forks: 90000,
    watchers: 7800,
    language: "C++",
    topics: ["machine-learning", "python", "deep-learning", "ai"],
    lastUpdated: "2024-03-20T18:45:00Z",
    weeklyGrowth: 450,
    url: "https://github.com/tensorflow/tensorflow"
  },
  {
    id: "repo-6",
    rank: 6,
    name: "vue",
    owner: "vuejs",
    ownerAvatar: "https://github.com/vuejs.png",
    description: "Vue.js is a progressive, incrementally-adoptable JavaScript framework for building UI on the web.",
    stars: 206000,
    forks: 34000,
    watchers: 5600,
    language: "TypeScript",
    topics: ["vue", "frontend", "framework", "javascript"],
    lastUpdated: "2024-03-21T08:10:00Z",
    weeklyGrowth: 350,
    url: "https://github.com/vuejs/core"
  },
  {
    id: "repo-7",
    rank: 7,
    name: "kubernetes",
    owner: "kubernetes",
    ownerAvatar: "https://github.com/kubernetes.png",
    description: "Production-Grade Container Scheduling and Management",
    stars: 104000,
    forks: 38000,
    watchers: 3400,
    language: "Go",
    topics: ["kubernetes", "go", "containers", "orchestration"],
    lastUpdated: "2024-03-21T15:30:00Z",
    weeklyGrowth: 280,
    url: "https://github.com/kubernetes/kubernetes"
  },
  {
    id: "repo-8",
    rank: 8,
    name: "pytorch",
    owner: "pytorch",
    ownerAvatar: "https://github.com/pytorch.png",
    description: "Tensors and Dynamic neural networks in Python with strong GPU acceleration",
    stars: 76000,
    forks: 21000,
    watchers: 2200,
    language: "Python",
    topics: ["pytorch", "machine-learning", "deep-learning", "ai"],
    lastUpdated: "2024-03-21T11:25:00Z",
    weeklyGrowth: 850,
    url: "https://github.com/pytorch/pytorch"
  },
  {
    id: "repo-9",
    rank: 9,
    name: "deno",
    owner: "denoland",
    ownerAvatar: "https://github.com/denoland.png",
    description: "A modern runtime for JavaScript and TypeScript.",
    stars: 92000,
    forks: 5100,
    watchers: 1700,
    language: "Rust",
    topics: ["deno", "javascript", "typescript", "rust"],
    lastUpdated: "2024-03-21T16:00:00Z",
    weeklyGrowth: 400,
    url: "https://github.com/denoland/deno"
  },
  {
    id: "repo-10",
    rank: 10,
    name: "flutter",
    owner: "flutter",
    ownerAvatar: "https://github.com/flutter.png",
    description: "Flutter makes it easy and fast to build beautiful apps for mobile and beyond",
    stars: 160000,
    forks: 26000,
    watchers: 3700,
    language: "Dart",
    topics: ["flutter", "dart", "mobile", "ios", "android"],
    lastUpdated: "2024-03-21T13:40:00Z",
    weeklyGrowth: 600,
    url: "https://github.com/flutter/flutter"
  },
  // Generate 20 more mock repositories
  ...Array.from({ length: 20 }).map((_, i) => ({
    id: `repo-${i + 11}`,
    rank: i + 11,
    name: `awesome-project-${i + 1}`,
    owner: `developer${i + 1}`,
    ownerAvatar: `https://github.com/github.png`,
    description: `An amazing open source project solving real world problems. Providing robust APIs and tools for modern developers.`,
    stars: (i * 1234) % 50000 + 1000,
    forks: (i * 432) % 10000 + 100,
    watchers: (i * 87) % 1000 + 10,
    language: ["TypeScript", "Rust", "Go", "Python", "JavaScript"][i % 5] || "TypeScript",
    topics: ["opensource", "tooling", "development"],
    lastUpdated: new Date(1700000000000 - i * 86400000).toISOString(),
    weeklyGrowth: (i * 33) % 1000 + 50,
    url: `https://github.com/developer${i + 1}/awesome-project-${i + 1}`
  }))
];
