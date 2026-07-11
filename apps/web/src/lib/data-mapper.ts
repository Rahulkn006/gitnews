import type { NewsItem } from "@/data/news";
import type { Repository } from "@/data/repositories";
type ApiRepository = {
  id: string;
  githubId: string;
  name: string;
  owner: string;
  avatar?: string;
  description?: string;
  stars: number;
  forks: number;
  language?: string;
  topics: string[];
  readme?: string;
  repoUrl: string;
  createdAt: string | number | Date;
  updatedAt: string | number | Date;
  trendingScore: number;
  aiSummary?: string;
  category?: string;
};

type ApiNews = {
  id: string;
  title: string;
  source: string;
  summary: string;
  category: string;
  date: string;
  url: string;
  createdAt: string | number | Date;
};

export function mapConvexRepo(
  repo: ApiRepository,
  index: number,
): Repository {
  return {
    id: repo.id,
    rank: index + 1,
    name: repo.name,
    owner: repo.owner,
    ownerAvatar: repo.avatar || "https://github.com/github.png",
    description:
      repo.aiSummary || repo.description || "An amazing open source project.",
    stars: repo.stars,
    forks: repo.forks,
    watchers: Math.floor(repo.stars * 0.05), // Estimate watchers
    language: repo.language || "Unknown",
    topics: repo.topics || [],
    lastUpdated: new Date(repo.updatedAt).toISOString(),
    weeklyGrowth: Math.floor(repo.forks * 0.1), // Estimate weekly growth
    url: repo.repoUrl,
  };
}

export function mapConvexNews(newsItem: ApiNews): NewsItem {
  let dateString = newsItem.date;
  if (!dateString.includes("T")) {
    dateString = new Date(newsItem.createdAt).toISOString();
  }

  let categoryStr: NewsItem["category"] = "New Releases";
  const validCategories = [
    "New Releases",
    "Breaking Changes",
    "Major Updates",
    "Developer Tools",
    "Security",
    "AI Projects",
  ];
  if (validCategories.includes(newsItem.category)) {
    categoryStr = newsItem.category as NewsItem["category"];
  } else if (newsItem.category.toLowerCase().includes("ai")) {
    categoryStr = "AI Projects";
  } else if (newsItem.category.toLowerCase().includes("tool")) {
    categoryStr = "Developer Tools";
  }

  // Consistent impact score based on string length (so it doesn't cause hydration errors with Math.random)
  const scoreBase = 80 + (newsItem.title.length % 20);

  return {
    id: newsItem.id,
    headline: newsItem.title,
    repository: newsItem.source, // Mapping source to repository field for now
    category: categoryStr,
    date: dateString,
    impactScore: scoreBase,
    explanation: newsItem.summary,
    url: newsItem.url,
  };
}

import type { LiveSignal } from "@/data/liveSignals";

export function mapLiveSignal(
  repo: ApiRepository,
  index: number,
): LiveSignal {
  const sourcesOptions = [
    ["GitHub", "Reddit", "Hacker News"],
    ["GitHub", "Twitter", "Product Hunt"],
    ["GitHub", "Hacker News"],
    ["GitHub", "Reddit", "Twitter"],
  ];

  return {
    id: repo.id,
    repository: `${repo.owner}/${repo.name}`,
    ownerAvatar: repo.avatar || "https://github.com/github.png",
    mentionsToday: Math.floor(repo.forks * 0.5) + index * 10,
    sources: sourcesOptions[index % sourcesOptions.length] || ["GitHub"],
    trendingScore: Math.min(100, Math.floor(80 + (repo.stars % 20))),
    sentiment: repo.stars % 3 === 0 ? "mixed" : "positive",
    explanation:
      repo.aiSummary ||
      repo.description ||
      "Gaining traction quickly among developers.",
    timestamp: new Date(repo.updatedAt).toISOString(),
  };
}
