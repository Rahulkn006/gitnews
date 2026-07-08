import { type Repository } from "../data/repositories";

const CACHE_TTL = 15 * 60 * 1000; // 15 minutes
const cache = new Map<string, { data: any; timestamp: number }>();

function getGitHubToken() {
  let token;
  try { token = (import.meta as any).env?.GITHUB_TOKEN; } catch (e) {}
  if (!token && typeof process !== "undefined") token = process.env.GITHUB_TOKEN;
  return token;
}

function getHeaders() {
  const token = getGitHubToken();
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'GitNews-App'
  };
  if (token) headers['Authorization'] = `token ${token}`;
  return headers;
}

export async function fetchGitHubAPI(endpoint: string) {
  const cacheKey = `gh_api_${endpoint}`;
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    const res = await fetch(`https://api.github.com${endpoint}`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`GitHub API error on ${endpoint}: ${res.statusText}`);
    const data = await res.json();
    cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  } catch (error) {
    console.error(`[GitHub] Failed to fetch ${endpoint}:`, error);
    if (cached) return cached.data;
    return null; // Handle null in caller
  }
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
    weeklyGrowth: Math.floor(item.stargazers_count * (0.01 + Math.random() * 0.05)),
    url: item.html_url,
  };
}

export async function fetchLiveTrendingRepos(): Promise<Repository[]> {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  const dateString = date.toISOString().split('T')[0];
  const query = `created:>${dateString}`;
  
  const data = await fetchGitHubAPI(`/search/repositories?q=${query}&sort=stars&order=desc&per_page=20`);
  if (data && data.items) {
    return data.items.map(mapGithubRepo);
  }
  return [];
}

export async function fetchLiveMarketRepos(query: string = "stars:>10000"): Promise<Repository[]> {
  const data = await fetchGitHubAPI(`/search/repositories?q=${query}&sort=updated&order=desc&per_page=30`);
  if (data && data.items) {
    return data.items.map(mapGithubRepo);
  }
  return [];
}

export async function fetchRepoTree(owner: string, repo: string): Promise<any> {
  const branchData = await fetchGitHubAPI(`/repos/${owner}/${repo}`);
  if (!branchData) return null;
  const defaultBranch = branchData.default_branch || "main";
  const treeData = await fetchGitHubAPI(`/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`);
  return treeData?.tree || [];
}

export async function fetchRepoFile(owner: string, repo: string, path: string): Promise<string | null> {
  const fileData = await fetchGitHubAPI(`/repos/${owner}/${repo}/contents/${path}`);
  if (fileData && fileData.content) {
    // Base64 decode
    if (typeof atob !== 'undefined') return atob(fileData.content);
    return Buffer.from(fileData.content, 'base64').toString('utf8');
  }
  return null;
}

export async function fetchRepoReadme(owner: string, repo: string): Promise<string | null> {
  const fileData = await fetchGitHubAPI(`/repos/${owner}/${repo}/readme`);
  if (fileData && fileData.content) {
    if (typeof atob !== 'undefined') return atob(fileData.content);
    return Buffer.from(fileData.content, 'base64').toString('utf8');
  }
  return null;
}
