import { getAuthUserId } from "@convex-dev/auth/server";
import { internalAction, internalMutation, query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.TOGETHER_API_KEY,
  baseURL: process.env.TOGETHER_BASE_URL,
});

const GITHUB_API_BASE = "https://api.github.com";
const DEFAULT_CATEGORY = "Tools";
const CATEGORY_ORDER = ["AI", "Web Development", "Mobile", "DevOps", "Data Science", "Tools"];

function buildCategory(name?: string | null): string {
  if (!name) return DEFAULT_CATEGORY;
  const normalized = name.trim().toLowerCase();
  const category = CATEGORY_ORDER.find((candidate) =>
    candidate.toLowerCase() === normalized,
  );
  return category ?? DEFAULT_CATEGORY;
}

function normalizeTopics(topics?: string[] | null): string[] {
  return (topics ?? []).slice(0, 10).map((topic) => topic.toLowerCase());
}

async function buildAiSummary(repo: GitHubRepository, readme?: string): Promise<string> {
  if (!process.env.TOGETHER_API_KEY) {
    const language = repo.language ?? "general purpose";
    const stars = repo.stargazers_count;
    const description = repo.description ? ` ${repo.description}` : "";
    return `A ${language} repository${description} with ${stars} stars and strong community momentum.`;
  }

  try {
    const textToAnalyze = `
Name: ${repo.name}
Description: ${repo.description ?? "None"}
Readme Excerpt: ${(readme ?? "").slice(0, 1000)}
    `;

    const response = await openai.chat.completions.create({
      model: "meta-llama/Llama-3-70b-chat-hf",
      messages: [
        {
          role: "system",
          content: "You are a professional tech analyst. Write a concise, 1-sentence description summarizing this GitHub repository's main purpose, uniqueness, and ideal developer use-case. Do not mention stars or numbers. Keep it under 20 words.",
        },
        {
          role: "user",
          content: textToAnalyze,
        },
      ],
      max_tokens: 60,
      temperature: 0.3,
    });

    const summary = response.choices[0]?.message?.content?.trim();
    if (summary) return summary;
  } catch (err) {
    console.error("Together AI summarization failed:", err);
  }

  return repo.description ?? "Open source repository with strong developer traction.";
}

type GitHubRepository = {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url?: string;
  };
  description?: string | null;
  stargazers_count: number;
  forks_count: number;
  language?: string | null;
  topics?: string[];
  html_url: string;
  created_at: string;
  updated_at: string;
  readme?: string;
};

type GitHubSearchResponse = {
  items?: GitHubRepository[];
};

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "gitnews-convex",
      ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

async function fetchReadme(owner: string, name: string): Promise<string | undefined> {
  try {
    const readme = await fetchJson<{ content?: string }>(
      `${GITHUB_API_BASE}/repos/${owner}/${name}/readme`,
    );
    if (!readme?.content) return undefined;
    return Buffer.from(readme.content, "base64").toString("utf-8");
  } catch {
    return undefined;
  }
}

async function fetchReposByEndpoint(endpoint: string): Promise<GitHubRepository[]> {
  const data = await fetchJson<GitHubRepository[] | GitHubSearchResponse>(
    `${GITHUB_API_BASE}${endpoint}`,
  );

  if (endpoint.includes("/search/repositories")) {
    return (data as GitHubSearchResponse).items ?? [];
  }

  return Array.isArray(data) ? data : [];
}

export const syncGitHubData = internalAction({
  args: {},
  handler: async (ctx) => {
    const [latest, trending, updated, starred] = await Promise.all([
      fetchReposByEndpoint(
        "/search/repositories?q=stars:>10&sort=updated&order=desc&per_page=20",
      ),
      fetchReposByEndpoint(
        "/search/repositories?q=stars:>100&sort=stars&order=desc&per_page=20",
      ),
      fetchReposByEndpoint(
        "/search/repositories?q=stars:>10&sort=updated&order=desc&per_page=20",
      ),
      fetchReposByEndpoint(
        "/search/repositories?q=stars:>1000&sort=stars&order=desc&per_page=20",
      ),
    ]);

    for (const category of CATEGORY_ORDER) {
      await ctx.runMutation(internal.github.upsertCategory, {
        name: category,
        slug: category.toLowerCase().replace(/\s+/g, "-"),
        description: `${category} repositories and tools`,
      });
    }

    const allRepos = [...latest, ...trending, ...updated, ...starred];
    const deduped = new Map<string, GitHubRepository>();
    for (const repo of allRepos) {
      deduped.set(repo.full_name, repo);
    }

    const repos = Array.from(deduped.values());
    for (const repo of repos) {
      const readme = await fetchReadme(repo.owner.login, repo.name);
      const aiSummary = await buildAiSummary(repo, readme);
      const starsVal = repo.stargazers_count ?? 0;
      const forksVal = repo.forks_count ?? 0;
      const createdTime = repo.created_at ? new Date(repo.created_at).getTime() : Date.now();
      const updatedTime = repo.updated_at ? new Date(repo.updated_at).getTime() : Date.now();

      await ctx.runMutation(internal.github.upsertRepository, {
        githubId: String(repo.id),
        name: repo.name,
        owner: repo.owner.login,
        avatar: repo.owner.avatar_url,
        description: repo.description ?? undefined,
        stars: starsVal,
        forks: forksVal,
        language: repo.language ?? undefined,
        topics: normalizeTopics(repo.topics),
        readme,
        repoUrl: repo.html_url,
        createdAt: isNaN(createdTime) ? Date.now() : createdTime,
        updatedAt: isNaN(updatedTime) ? Date.now() : updatedTime,
        trendingScore: starsVal + forksVal,
        aiSummary,
        category: buildCategory(repo.language ?? repo.name),
      });
    }

    await ctx.scheduler.runAfter(60 * 60 * 1000, internal.github.syncGitHubData, {});
  },
});

export const upsertCategory = internalMutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, args);
      return existing._id;
    }

    return ctx.db.insert("categories", args);
  },
});

export const upsertRepository = internalMutation({
  args: {
    githubId: v.string(),
    name: v.string(),
    owner: v.string(),
    avatar: v.optional(v.string()),
    description: v.optional(v.string()),
    stars: v.number(),
    forks: v.number(),
    language: v.optional(v.string()),
    topics: v.array(v.string()),
    readme: v.optional(v.string()),
    repoUrl: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    trendingScore: v.number(),
    aiSummary: v.optional(v.string()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("repositories")
      .withIndex("by_github_id", (q) => q.eq("githubId", args.githubId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, args);
      return existing._id;
    }

    return ctx.db.insert("repositories", args);
  },
});

export const getLatestRepos = query({
  args: {},
  handler: async (ctx) => {
    const repos = await ctx.db.query("repositories").collect();
    return repos
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, 12);
  },
});

export const getTrendingRepos = query({
  args: {},
  handler: async (ctx) => {
    const repos = await ctx.db.query("repositories").collect();
    return repos
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, 12);
  },
});

export const getFeaturedRepos = query({
  args: {},
  handler: async (ctx) => {
    const repos = await ctx.db.query("repositories").collect();
    return repos
      .sort((a, b) => b.stars - a.stars)
      .slice(0, 12);
  },
});

export const getCategories = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("categories").collect();
  },
});

export const getRepoDetails = query({
  args: { githubId: v.string() },
  handler: async (ctx, { githubId }) => {
    const repo = await ctx.db
      .query("repositories")
      .withIndex("by_github_id", (q) => q.eq("githubId", githubId))
      .unique();
    return repo ?? null;
  },
});

export const getReposByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, { category }) => {
    const repos = await ctx.db.query("repositories").collect();
    return repos
      .filter((repo) => repo.category === category)
      .sort((a, b) => b.stars - a.stars)
      .slice(0, 24);
  },
});

export const bookmarkRepo = mutation({
  args: { repositoryId: v.id("repositories") },
  handler: async (ctx, { repositoryId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("bookmarks")
      .withIndex("by_user_repository", (q) => q.eq("userId", userId).eq("repositoryId", repositoryId))
      .unique();

    if (existing) return existing._id;

    return ctx.db.insert("bookmarks", {
      userId,
      repositoryId,
      createdAt: Date.now(),
    });
  },
});

export const removeBookmark = mutation({
  args: { repositoryId: v.id("repositories") },
  handler: async (ctx, { repositoryId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("bookmarks")
      .withIndex("by_user_repository", (q) => q.eq("userId", userId).eq("repositoryId", repositoryId))
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});

export const toggleBookmark = mutation({
  args: { repositoryId: v.id("repositories") },
  handler: async (ctx, { repositoryId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("bookmarks")
      .withIndex("by_user_repository", (q) => q.eq("userId", userId).eq("repositoryId", repositoryId))
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
      return false;
    }

    await ctx.db.insert("bookmarks", {
      userId,
      repositoryId,
      createdAt: Date.now(),
    });

    return true;
  },
});

export const getBookmarks = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const bookmarks = await ctx.db
      .query("bookmarks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const repos = await Promise.all(
      bookmarks.map(async (bookmark) => ctx.db.get(bookmark.repositoryId)),
    );

    return repos.filter((repo): repo is NonNullable<typeof repo> => Boolean(repo));
  },
});

export const scheduleGitHubSync = internalMutation({
  args: {},
  handler: async (ctx) => {
    await ctx.scheduler.runAfter(0, internal.github.syncGitHubData, {});
  },
});
