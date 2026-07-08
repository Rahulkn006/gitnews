import { type Repository } from "../data/repositories";

const CACHE_TTL = 15 * 60 * 1000; // 15 minutes
let cachedTrending: { data: Repository[]; timestamp: number } | null = null;
let cachedMarket: { data: Repository[]; timestamp: number } | null = null;

// Get a random growth number for demo purposes until we have historical data
function generateGrowth(stars: number) {
  const percentage = 0.01 + Math.random() * 0.05; // 1% to 6% weekly growth
  return Math.floor(stars * percentage);
}

function mapGithubRepo(item: any, index: number): Repository {
  return {
    id: item.id.toString(),
    rank: index + 1,
    name: item.name,
    owner: item.owner.login,
    ownerAvatar: item.owner.avatar_url,
    description: item.description || "No description provided.",
    stars: item.stargazers_count,
    forks: item.forks_count,
    watchers: item.watchers_count || 0,
    language: item.language || "Unknown",
    topics: item.topics || [],
    lastUpdated: item.updated_at,
    weeklyGrowth: generateGrowth(item.stargazers_count),
    url: item.html_url,
  };
}

export async function fetchLiveTrendingRepos(): Promise<Repository[]> {
  if (cachedTrending && Date.now() - cachedTrending.timestamp < CACHE_TTL) {
    console.log("[GitHub] Returning cached trending repos");
    return cachedTrending.data;
  }

  try {
    console.log("[GitHub] Fetching live trending repos...");
    // Fetch repos created in the last 30 days, sorted by stars
    const date = new Date();
    date.setDate(date.getDate() - 30);
    const dateString = date.toISOString().split('T')[0];
    
    // Check import.meta.env first (Astro), then process.env (Node)
    let token;
    try { token = (import.meta as any).env?.GITHUB_TOKEN; } catch (e) {}
    if (!token && typeof process !== "undefined") token = process.env.GITHUB_TOKEN;

    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'GitNews-App'
    };
    if (token) headers['Authorization'] = `token ${token}`;

    const res = await fetch(
      `https://api.github.com/search/repositories?q=created:>${dateString}&sort=stars&order=desc&per_page=20`,
      { headers }
    );

    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.statusText}`);
    }

    const data = await res.json();
    const repos = data.items.map(mapGithubRepo);
    
    cachedTrending = { data: repos, timestamp: Date.now() };
    return repos;
  } catch (error) {
    console.error("[GitHub] Failed to fetch live data:", error);
    if (cachedTrending) return cachedTrending.data; // fallback to stale cache
    return []; // Will fallback to mock in the caller if empty
  }
}

export async function fetchLiveMarketRepos(query: string = "stars:>10000"): Promise<Repository[]> {
  if (cachedMarket && Date.now() - cachedMarket.timestamp < CACHE_TTL) {
    return cachedMarket.data;
  }

  try {
    let token;
    try { token = (import.meta as any).env?.GITHUB_TOKEN; } catch (e) {}
    if (!token && typeof process !== "undefined") token = process.env.GITHUB_TOKEN;

    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'GitNews-App'
    };
    if (token) headers['Authorization'] = `token ${token}`;

    const res = await fetch(
      `https://api.github.com/search/repositories?q=${query}&sort=updated&order=desc&per_page=30`,
      { headers }
    );

    if (!res.ok) throw new Error(`GitHub API error: ${res.statusText}`);

    const data = await res.json();
    const repos = data.items.map(mapGithubRepo);
    
    cachedMarket = { data: repos, timestamp: Date.now() };
    return repos;
  } catch (error) {
    console.error("[GitHub] Failed to fetch market data:", error);
    if (cachedMarket) return cachedMarket.data;
    return [];
  }
}
